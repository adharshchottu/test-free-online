package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gomodule/redigo/redis"
)

var allowedURLs = []string{
	"https://tools.typinks.com",
	"https://tools.typinks.com/blog",
	"https://tools.typinks.com/blog/comment-tester-sse-en-ligne",
	"https://tools.typinks.com/blog/how-to-test-sse-online",
	"https://tools.typinks.com/kroenger-poster-generator",
	"https://tools.typinks.com/redis-lua",
	"https://tools.typinks.com/slide-puzzle",
	"https://tools.typinks.com/sse",
	"https://tools.typinks.com/sudoku",
	"https://tools.typinks.com/typinks-poster-generator",
	"https://tools.typinks.com/blog/comment-jouer-au-jeu-puzzle-coulissant-en-ligne",
	"https://tools.typinks.com/blog/comment-jouer-au-sudoku-en-ligne-gratuit-illimite",
	"https://tools.typinks.com/blog/comment-tester-sse-en-ligne",
	"https://tools.typinks.com/blog/comment-utiliser-le-calculateur-notes-examens-preliminaires-en-ligne",
	"https://tools.typinks.com/blog/comment-utiliser-le-calculateur-temps-vie-en-ligne",
	"https://tools.typinks.com/blog/comment-utiliser-le-generateur-affiches-kroenger-en-ligne",
	"https://tools.typinks.com/blog/comment-utiliser-le-generateur-affiches-typinks-en-ligne",
	"https://tools.typinks.com/blog/comment-utiliser-le-testeur-en-ligne-de-script-lua-redis",
	"https://tools.typinks.com/blog/how-to-play-slide-puzzle-game-online",
	"https://tools.typinks.com/blog/how-to-play-sudoku-online-free-unlimited",
	"https://tools.typinks.com/blog/how-to-test-redis-lua-script-online",
	"https://tools.typinks.com/blog/how-to-test-sse-online",
	"https://tools.typinks.com/blog/how-to-use-kroenger-poster-generator-online",
	"https://tools.typinks.com/blog/how-to-use-life-time-calculator-online",
	"https://tools.typinks.com/blog/how-to-use-prelims-marks-calculator-online",
	"https://tools.typinks.com/blog/how-to-use-typinks-poster-generator-online",
}

type ChatMessage struct {
	User             string `json:"user"`
	Message          string `json:"message"`
	Timezone         string `json:"timezone"`
	LocalTime        string `json:"local_time"`
	Language         string `json:"language"`
	ScreenResolution string `json:"screen_resolution"`
	UserAgent        string `json:"user_agent"`
	Platform         string `json:"platform"`
	IP               string `json:"ip"`
	Timestamp        int64  `json:"timestamp"`
}

type ChatUIData struct {
	User      string `json:"user"`
	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`
}

func addChatMessage(conn redis.Conn, msgJSON string) error {
	redisKey := "typinks-chat-room"

	// Send both commands sequentially via pipeline/multi to avoid unnecessary round-trips
	if err := conn.Send("LPUSH", redisKey, msgJSON); err != nil {
		return err
	}
	if err := conn.Send("LTRIM", redisKey, 0, 9); err != nil {
		return err
	}

	// Flush and receive replies
	if err := conn.Flush(); err != nil {
		return err
	}
	_, err := conn.Do("") // Clears the reply queue and returns error if any executed failed
	return err
}

// Redis logic for retrieving the last 100 messages
func getChatMessages(conn redis.Conn) ([]string, error) {
	redisKey := "typinks-chat-room"
	// LRANGE key 0 -1 returns all existing items (which is max 100 due to LTRIM)
	messages, err := redis.Strings(conn.Do("LRANGE", redisKey, 0, -1))
	if err != nil {
		return nil, err
	}
	return messages, nil
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

func sendRawJSONResponse(w http.ResponseWriter, rawJSON string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	fmt.Fprintf(w, rawJSON)
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

	allowedOrigin := "https://tools.typinks.com"
	if origin != allowedOrigin && (referer == "" || !strings.HasPrefix(referer, allowedOrigin)) {
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		sendResponse(w, "Theobroma cacao", http.StatusForbidden)
		return false
	}

	w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
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
	redisUsername := os.Getenv("REDIS_USERNAME")

	conn, err := redis.Dial("tcp", redisAddress, redis.DialUsername(redisUsername), redis.DialPassword(redisPassword))
	if err != nil {
		sendResponse(w, "redis connection failed", http.StatusBadRequest)
		return
	}
	defer conn.Close()

	ip := getClientIP(r)
	if ip == "" {
		sendResponse(w, "beep beep beep", http.StatusInternalServerError)
		return
	}

	switch r.URL.Path {
	case "/api/count-user":
		url := r.URL.Query().Get("url")
		if url == "" {
			sendResponse(w, "falta al URL", http.StatusBadRequest)
			return
		}

		if !isURLAllowed(url) {
			sendResponse(w, "no no no", http.StatusForbidden)
			return
		}

		incrementUserCount(conn, url, ip)
		count, err := getUserCount(conn, url)
		if err != nil {
			sendResponse(w, `{"count":1}`, http.StatusBadRequest)
			return
		}
		sendResponse(w, fmt.Sprintf(`{"count":%d}`, count), http.StatusOK)
		return
	case "/api/chat/messages":
		if r.Method != http.MethodGet {
			sendResponse(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		rawMessages, err := getChatMessages(conn)
		if err != nil {
			sendResponse(w, "Failed to retrieve chat logs", http.StatusInternalServerError)
			return
		}

		uiMessages := make([]ChatUIData, 0, len(rawMessages))
		for _, rawMsg := range rawMessages {
			var fullMsg ChatMessage

			// Unmarshal the full Redis JSON string into the large struct
			if err := json.Unmarshal([]byte(rawMsg), &fullMsg); err != nil {
				// Log the error but skip broken messages so the API doesn't crash
				log.Printf("Error unmarshaling chat message: %v", err)
				continue
			}

			// Copy over only what the UI needs
			uiMessages = append(uiMessages, ChatUIData{
				User:      fullMsg.User,
				Message:   fullMsg.Message,
				Timestamp: fullMsg.Timestamp,
			})
		}

		cleanJSONBytes, err := json.Marshal(uiMessages)
		if err != nil {
			sendResponse(w, "Failed to process payload", http.StatusInternalServerError)
			return
		}

		sendRawJSONResponse(w, string(cleanJSONBytes), http.StatusOK)
		return

	case "/api/chat/message":
		if r.Method != http.MethodPost {
			sendResponse(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var chatMsg ChatMessage
		err := json.NewDecoder(r.Body).Decode(&chatMsg)
		if err != nil || chatMsg.Message == "" {
			sendResponse(w, "Invalid message content", http.StatusBadRequest)
			return
		}

		chatMsg.IP = ip
		chatMsg.Timestamp = time.Now().Unix()

		// Re-encode object into compact single-line JSON string to store inside Redis list
		msgBytes, err := json.Marshal(chatMsg)
		if err != nil {
			sendResponse(w, "Internal marshal failure", http.StatusInternalServerError)
			return
		}

		err = addChatMessage(conn, string(msgBytes))
		if err != nil {
			sendResponse(w, "Failed to save message", http.StatusInternalServerError)
			return
		}

		sendResponse(w, "success", http.StatusOK)
		return

	default:
		sendResponse(w, "ha ha", http.StatusNotFound)
	}
}
