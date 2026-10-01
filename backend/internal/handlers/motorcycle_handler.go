package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/models"
)

type MotorcycleHandler struct {
	DB *gorm.DB
}

func NewMotorcycleHandler(db *gorm.DB) *MotorcycleHandler {
	return &MotorcycleHandler{DB: db}
}

// GetMotorcycles возвращает список мотоциклов с возможностью фильтрации
func (h *MotorcycleHandler) GetMotorcycles(c *gin.Context) {
	var motorcycles []models.Motorcycle

	query := h.DB.Preload("Brand").Preload("PriceAnalytics")

	// Фильтрация по брендам (например: ?brands=1,2,3)
	brandIDs := c.Query("brands")
	if brandIDs != "" {
		ids := strings.Split(brandIDs, ",")
		query = query.Where("brand_id IN ?", ids)
	}

	result := query.Find(&motorcycles)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, motorcycles)
}

// GetMotorcycleByID возвращает детальную информацию по одному мотоциклу
func (h *MotorcycleHandler) GetMotorcycleByID(c *gin.Context) {
	id := c.Param("id")
	var motorcycle models.Motorcycle

	result := h.DB.Preload("Brand").Preload("Spec").Preload("PriceAnalytics").First(&motorcycle, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Мотоцикл не найден"})
		return
	}
	c.JSON(http.StatusOK, motorcycle)
}
