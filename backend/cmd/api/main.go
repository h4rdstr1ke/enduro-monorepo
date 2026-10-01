package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/database"
	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/handlers"
)

func main() {
	// Подключаемся к нашей БД
	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v", err)
	}

	// Инициализируем обработчики
	motoHandler := handlers.NewMotorcycleHandler(db)

	// Инициализируем роутер Gin
	r := gin.Default()

	// Разрешаем CORS для локальной разработки фронтенда
	r.Use(cors.Default())

	// Группируем роуты
	v1 := r.Group("/api/v1")
	{
		v1.GET("/motorcycles", motoHandler.GetMotorcycles)
		v1.GET("/motorcycles/:id", motoHandler.GetMotorcycleByID)
	}

	log.Println("API сервер запущен на http://localhost:8080")

	// Запускаем сервер на порту 8080
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Ошибка запуска сервера: %v", err)
	}
}
