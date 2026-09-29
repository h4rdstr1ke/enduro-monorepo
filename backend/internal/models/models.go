// Package models содержит структуры данных, отображаемые на таблицы базы данных (GORM).
package models

import (
	"time"

	"gorm.io/gorm"
)

// Brand представляет производителя мотоциклов (например, KTM, Kayo).[cite: 9]
type Brand struct {
	gorm.Model
	Name        string `gorm:"uniqueIndex;not null"`
	Country     string
	Motorcycles []Motorcycle
}

// Motorcycle содержит базовую информацию о конкретной модели мотоцикла.[cite: 9]
type Motorcycle struct {
	gorm.Model
	BrandID   uint `gorm:"index;not null"`
	Brand     Brand
	ModelName string `gorm:"not null"`
	Image     string
	Status    string
	Category  string

	Spec           Spec
	PriceAnalytics PriceAnalytics `gorm:"foreignKey:MotorcycleID"`
}

// PriceAnalytics содержит агрегированные данные о стоимости
type PriceAnalytics struct {
	gorm.Model
	MotorcycleID  uint `gorm:"uniqueIndex;not null"`
	Average       float64
	Min           float64
	Max           float64
	MinSourceName string
	MinSourceUrl  string
	MaxSourceName string
	Currency      string
	ParsedAt      time.Time
}

// Spec содержит подробные технические характеристики мотоцикла.[cite: 9]
// Типы данных (int, float64) оставлены для удобства поиска и фильтрации в БД.
// При передаче на фронтенд будем форматировать их в строки.
type Spec struct {
	gorm.Model
	MotorcycleID uint `gorm:"uniqueIndex;not null"`

	Displacement int
	Type         string
	Power        float64
	Weight       int
	HasPTS       bool

	Engine       string
	Cooling      string
	FuelSystem   string
	TankCapacity int
	Starter      string
	Clutch       string

	FrontSusp  string
	RearSusp   string
	FrontBrake string
	RearBrake  string
	Wheels     string

	Dimensions string
	Wheelbase  int
	SeatHeight int
	Clearance  int
}
