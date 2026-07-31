package api

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
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
	"https://tools.typinks.com/chat",
	"https://tools.typinks.com/text-editor",
	"https://tools.typinks.com/planner",
	"https://tools.typinks.com/prelims-marks-calculator",
	"https://tools.typinks.com/life-time-calculator",
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

var allowedUsers = []string{
	"adharsh", "benny", "ouseph", "stephen", "martin", "santhosh", "reju",
	"job", "baby", "abin", "tinil", "dolly", "jojo", "dominic", "jobin",
	"scott", "mati", "lucas", "reynolds", "edison", "shibu", "ruban",
	"peter", "sebastian", "lalan", "sansilo", "tomy", "joy",
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

type ImageChatMessage struct {
	User      string `json:"user"`
	ImageURL  string `json:"image_url"`
	Timestamp int64  `json:"timestamp"`
}

const maxImageSize = 15 * 1024 * 1024

var imageExtensions = map[string]string{
	"image/jpeg": ".jpg",
	"image/png":  ".png",
	"image/gif":  ".gif",
	"image/webp": ".webp",
}

func isUserAllowed(user string) bool {
	for _, allowedUser := range allowedUsers {
		if user == allowedUser {
			return true
		}
	}
	return false
}

func addChatMessage(conn redis.Conn, msgJSON string) error {
	redisKey := "typinks-chat-room"

	// Validate JSON and message content before storing
	var msg ChatMessage
	if err := json.Unmarshal([]byte(msgJSON), &msg); err != nil {
		return fmt.Errorf("invalid message JSON: %v", err)
	}

	// Check for corrupted content (Go's missing value pattern)
	if strings.Contains(msg.Message, "%!(MISSING)") || strings.Contains(msg.Message, "%!A(") {
		return fmt.Errorf("message contains corrupted data")
	}

	// Send both commands sequentially via pipeline/multi to avoid unnecessary round-trips
	if err := conn.Send("LPUSH", redisKey, msgJSON); err != nil {
		return err
	}
	if err := conn.Send("LTRIM", redisKey, 0, 999); err != nil {
		return err
	}

	// Flush and receive replies
	if err := conn.Flush(); err != nil {
		return err
	}
	_, err := conn.Do("")
	return err
}

func addImageChatMessage(conn redis.Conn, message ImageChatMessage) error {
	messageJSON, err := json.Marshal(message)
	if err != nil {
		return err
	}

	if err := conn.Send("LPUSH", "typinks-image-chat-room", messageJSON); err != nil {
		return err
	}
	if err := conn.Send("LTRIM", "typinks-image-chat-room", 0, 999); err != nil {
		return err
	}
	if err := conn.Flush(); err != nil {
		return err
	}
	_, err = conn.Do("")
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

func getImageChatMessages(conn redis.Conn) ([]ImageChatMessage, error) {
	rawMessages, err := redis.Strings(conn.Do("LRANGE", "typinks-image-chat-room", 0, -1))
	if err != nil {
		return nil, err
	}

	messages := make([]ImageChatMessage, 0, len(rawMessages))
	for _, rawMessage := range rawMessages {
		var message ImageChatMessage
		if err := json.Unmarshal([]byte(rawMessage), &message); err != nil {
			log.Printf("Error unmarshaling image chat message: %v", err)
			continue
		}
		messages = append(messages, message)
	}
	return messages, nil
}

func uploadImageToSupabase(image io.Reader, contentType string) (string, error) {
	bucket := os.Getenv("SUPABASE_IMAGE_CHAT_BUCKET")
	s3Endpoint := strings.TrimRight(os.Getenv("SUPABASE_S3_ENDPOINT"), "/")
	s3AccessKeyID := os.Getenv("SUPABASE_S3_ACCESS_KEY_ID")
	s3SecretAccessKey := os.Getenv("SUPABASE_S3_SECRET_ACCESS_KEY")
	if bucket == "" || s3Endpoint == "" || s3AccessKeyID == "" || s3SecretAccessKey == "" {
		return "", fmt.Errorf("Supabase image chat configuration is missing")
	}

	randomBytes := make([]byte, 16)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", fmt.Errorf("generate image key: %w", err)
	}
	objectName := fmt.Sprintf("image-chat/%d-%x%s", time.Now().UnixNano(), randomBytes, imageExtensions[contentType])
	awsConfig, err := config.LoadDefaultConfig(
		context.Background(),
		config.WithRegion("ap-southeast-2"),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(s3AccessKeyID, s3SecretAccessKey, "")),
	)
	if err != nil {
		return "", fmt.Errorf("create S3 configuration: %w", err)
	}
	s3Client := s3.NewFromConfig(awsConfig, func(options *s3.Options) {
		options.BaseEndpoint = aws.String(s3Endpoint)
		options.UsePathStyle = true
	})
	_, err = s3Client.PutObject(context.Background(), &s3.PutObjectInput{
		Bucket:      aws.String(bucket),
		Key:         aws.String(objectName),
		Body:        image,
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return "", fmt.Errorf("upload image through S3: %w", err)
	}

	publicBaseURL, err := publicSupabaseURL(s3Endpoint)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s/storage/v1/object/public/%s/%s", publicBaseURL, url.PathEscape(bucket), objectName), nil
}

func publicSupabaseURL(s3Endpoint string) (string, error) {
	endpointURL, err := url.Parse(s3Endpoint)
	if err != nil || endpointURL.Scheme != "https" || !strings.HasSuffix(endpointURL.Host, ".storage.supabase.co") {
		return "", fmt.Errorf("invalid Supabase S3 endpoint")
	}

	projectRef := strings.TrimSuffix(endpointURL.Host, ".storage.supabase.co")
	return "https://" + projectRef + ".supabase.co", nil
}

func handleImageChatUpload(w http.ResponseWriter, r *http.Request, conn redis.Conn) {
	r.Body = http.MaxBytesReader(w, r.Body, maxImageSize+1024*1024)
	if err := r.ParseMultipartForm(maxImageSize + 1024*1024); err != nil {
		sendResponse(w, "Image must be 15 MB or smaller", http.StatusRequestEntityTooLarge)
		return
	}

	user := r.FormValue("user")
	if !isUserAllowed(user) {
		sendResponse(w, "quién eres?", http.StatusForbidden)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		sendResponse(w, "An image is required", http.StatusBadRequest)
		return
	}
	defer file.Close()
	if header.Size > maxImageSize {
		sendResponse(w, "Image must be 15 MB or smaller", http.StatusRequestEntityTooLarge)
		return
	}

	imageHeader := make([]byte, 512)
	bytesRead, err := io.ReadFull(file, imageHeader)
	if err != nil && err != io.ErrUnexpectedEOF {
		sendResponse(w, "Unable to read image", http.StatusBadRequest)
		return
	}
	imageHeader = imageHeader[:bytesRead]
	contentType := http.DetectContentType(imageHeader)
	if _, allowed := imageExtensions[contentType]; !allowed {
		sendResponse(w, "Only JPEG, PNG, GIF, and WebP images are allowed", http.StatusUnsupportedMediaType)
		return
	}

	imageURL, err := uploadImageToSupabase(io.MultiReader(bytes.NewReader(imageHeader), file), contentType)
	if err != nil {
		log.Printf("Error uploading image chat file: %v", err)
		sendResponse(w, "Unable to upload image", http.StatusBadGateway)
		return
	}

	if err := addImageChatMessage(conn, ImageChatMessage{User: user, ImageURL: imageURL, Timestamp: time.Now().Unix()}); err != nil {
		log.Printf("Error saving image chat message: %v", err)
		sendResponse(w, "Unable to save image message", http.StatusInternalServerError)
		return
	}
	sendResponse(w, "success", http.StatusOK)
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

	allowedOrigins := map[string]bool{
		"https://tools.typinks.com": true,
		"http://localhost:4321":     true,
	}

	if !allowedOrigins[origin] {
		sendResponse(w, "Theobroma cacao", http.StatusForbidden)
		return false
	}

	w.Header().Set("Access-Control-Allow-Origin", origin)

	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return false
	}

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
	case "/api/image-chat/messages":
		if r.Method != http.MethodGet {
			sendResponse(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		messages, err := getImageChatMessages(conn)
		if err != nil {
			sendResponse(w, "Failed to retrieve image chat logs", http.StatusInternalServerError)
			return
		}
		imageJSON, err := json.Marshal(messages)
		if err != nil {
			sendResponse(w, "Failed to process image chat logs", http.StatusInternalServerError)
			return
		}
		sendRawJSONResponse(w, string(imageJSON), http.StatusOK)
		return

	case "/api/image-chat/message":
		if r.Method != http.MethodPost {
			sendResponse(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		handleImageChatUpload(w, r, conn)
		return

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

		if !isUserAllowed(chatMsg.User) {
			sendResponse(w, "quién eres?", http.StatusForbidden)
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
			log.Printf("Error saving message: %v", err)
			sendResponse(w, "Failed to save message", http.StatusInternalServerError)
			return
		}

		sendResponse(w, "success", http.StatusOK)
		return

	default:
		sendResponse(w, "ha ha", http.StatusNotFound)
	}
}
