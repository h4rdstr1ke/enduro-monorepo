package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/h4rdstr1ke/enduro-monorepo/backend/internal/models"
)

type BrandHandler struct {
	DB *gorm.DB
}

func NewBrandHandler(db *gorm.DB) *BrandHandler {
	return &BrandHandler{DB: db}
}

// GetBrands возвращает список всех брендов
func (h *BrandHandler) GetBrands(c *gin.Context) {
	var brands []models.Brand

	// Сортируем бренды по алфавиту для удобства на фронтенде
	result := h.DB.Order("name asc").Find(&brands)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, brands)
}
