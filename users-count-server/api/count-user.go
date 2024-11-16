package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strings"

	"github.com/gomodule/redigo/redis"
)

var allowedURLs = []string{
	"https://test-free.online",
	"https://test-free.online/blog/comment-tester-sse-en-ligne",
	"https://test-free.online/blog/how-to-test-sse-online",
	"https://test-free.online/kroenger-poster-generator",
	"https://test-free.online/redis-lua",
	"https://test-free.online/slide-puzzle",
	"https://test-free.online/sse",
	"https://test-free.online/typinks-poster-generator",
}

func incrementUserCount(conn redis.Conn, url string, ip string) {
	// Add user IP to the set for the URL
	_, err := conn.Do("SADD", fmt.Sprintf("user_set:%s", url), ip)
	if err != nil {
		log.Printf("Error adding IP to set for %s: %v", url, err)
	}

	// Set expiration for the URL user set
	_, err = conn.Do("EXPIRE", fmt.Sprintf("user_set:%s", url), 60) // Expire in 60 seconds
	if err != nil {
		log.Printf("Error setting expiration for user set for %s: %v", url, err)
	}
}

func getUserCount(conn redis.Conn, url string) (int, error) {
	count, err := redis.Int(conn.Do("SCARD", fmt.Sprintf("user_set:%s", url)))
	if err != nil {
		return 0, err
	}
	return count, nil
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

func getClientIP(r *http.Request) string {
	// Check the X-Forwarded-For header for the client IP
	xForwardedFor := r.Header.Get("X-Forwarded-For")
	if xForwardedFor != "" {
		// Extract the first IP address in the list
		ip := xForwardedFor
		if idx := strings.Index(ip, ","); idx != -1 {
			ip = ip[:idx]
		}
		return strings.TrimSpace(ip)
	}

	// Fallback to RemoteAddr if X-Forwarded-For is not present
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return ""
	}
	return ip
}

func setPreflighHeader(w http.ResponseWriter, r *http.Request) bool {
	origin := r.Header.Get("Origin")
	referer := r.Header.Get("Referer")

	allowedOrigin := "https://test-free.online"
	if origin != allowedOrigin && (referer == "" || !strings.HasPrefix(referer, allowedOrigin)) {
		sendResponse(w, "Theobroma cacao", http.StatusForbidden)
		return false
	}

	w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	return true
}

// Function to check if a URL is allowed
func isURLAllowed(url string) bool {
	for _, allowedURL := range allowedURLs {
		if url == allowedURL || url == allowedURL+"/" {
			return true
		}
	}
	return false
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if !setPreflighHeader(w, r) {
		return
	}

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

	url := r.URL.Query().Get("url")
	if url == "" {
		sendResponse(w, "falta al URL", http.StatusBadRequest)
		return
	}

	if !isURLAllowed(url) {
		sendResponse(w, "no no no", http.StatusForbidden)
		return
	}

	ip := getClientIP(r)
	if ip == "" {
		sendResponse(w, "beep beep beep", http.StatusInternalServerError)
		return
	}

	switch r.URL.Path {
	case "/api/count-user":
		incrementUserCount(conn, url, ip)
		count, err := getUserCount(conn, url)
		if err != nil {
			sendResponse(w, `{"count":1}`, http.StatusBadRequest)
			return
		}
		sendResponse(w, fmt.Sprintf(`{"count":%d}`, count), http.StatusOK)
		return
	default:
		sendResponse(w, "ha ha", http.StatusNotFound)
	}
}
