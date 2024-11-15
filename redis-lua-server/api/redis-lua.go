package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gomodule/redigo/redis"
)

type RedisLuaData struct {
	Script    string   `json:"script"`
	Arguments []string `json:"arguments"`
}

func setPreflighHeader(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func Handler(w http.ResponseWriter, r *http.Request) {
	setPreflighHeader(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	// Get Redis address and password from environment variables
	redisAddress := os.Getenv("REDIS_ADDRESS")
	redisPassword := os.Getenv("REDIS_PASSWORD")

	conn, err := redis.Dial("tcp", redisAddress, redis.DialPassword(redisPassword))
	if err != nil {
		log.Printf("Failed to connect to Redis server: %v", err)
		sendResponse(w, "redis connection failed", http.StatusBadRequest)
		return
	}

	// Read the JSON body
	var data RedisLuaData
	jsonDecodeErr := json.NewDecoder(r.Body).Decode(&data)
	if jsonDecodeErr != nil {
		// Handle error
		log.Printf("error running script: %s", jsonDecodeErr)
		sendResponse(w, jsonDecodeErr.Error(), http.StatusBadRequest)
		return
	}

	args := make([]interface{}, len(data.Arguments))
	for i, arg := range data.Arguments {
		args[i] = arg
	}

	script := redis.NewScript(0, data.Script)
	response, errNew := script.Do(conn, data.Arguments[0])
	if errNew != nil {
		log.Printf("error running script: %s", errNew)
		sendResponse(w, errNew.Error(), http.StatusBadRequest)
		return
	}

	switch v := response.(type) {
	case []uint8:
		// Handle the case where the response is a byte slice
		sendResponse(w, fmt.Sprintf("%s", v), http.StatusOK)
		return

	case []interface{}:
		// Handle the case where the response is a slice of interfaces
		var result []string
		for _, item := range v {
			if bytes, ok := item.([]uint8); ok {
				result = append(result, string(bytes))
			} else {
				log.Printf("unexpected item type: %T", item)
				log.Printf("%v", item)
				return
			}
		}
		joinedResult := strings.Join(result, " ")
		sendResponse(w, joinedResult, http.StatusOK)
		return

	case redis.Error:
		// Handle Redis error
		log.Printf("Redis error: %v", v)
		sendResponse(w, v.Error(), http.StatusInternalServerError)
		return

	default:
		log.Printf("unexpected response type: %T", v)
		sendResponse(w, "unexpected response type", http.StatusInternalServerError)
		return
	}

}

func sendResponse(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	responseMessage := map[string]interface{}{
		"data": message,
	}
	jsonString, err := json.Marshal(responseMessage)
	if err != nil {
		w.WriteHeader(http.StatusBadGateway)
		fmt.Fprintf(w, `{"data":"error sending response"}`)
	}
	fmt.Fprint(w, string(jsonString))
}
