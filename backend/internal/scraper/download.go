package scraper

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// downloadImage скачивает картинку и возвращает локальный путь
func downloadImage(imageURL string, title string) string {
	if imageURL == "" {
		return ""
	}
	
	// Создаем папку uploads, если её нет
	uploadDir := "uploads"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return ""
	}

	// Генерируем безопасное имя файла
	safeTitle := strings.ReplaceAll(strings.ToLower(title), " ", "-")
	safeTitle = strings.ReplaceAll(safeTitle, "/", "-")
	ext := ".jpg"
	if strings.Contains(strings.ToLower(imageURL), ".png") {
		ext = ".png"
	}
	
	filename := fmt.Sprintf("%s-%d%s", safeTitle, time.Now().Unix(), ext)
	filepath := filepath.Join(uploadDir, filename)

	// Скачиваем
	resp, err := http.Get(imageURL)
	if err != nil || resp.StatusCode != 200 {
		return ""
	}
	defer resp.Body.Close()

	out, err := os.Create(filepath)
	if err != nil {
		return ""
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return ""
	}

	// Возвращаем публичный путь для фронтенда
	return "/" + filepath
}
