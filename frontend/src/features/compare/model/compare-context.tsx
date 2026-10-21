"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";

export interface CompareItem {
  id: number;
  title: string;
  image: string;
  brandName: string;
  price?: number;
}

interface CompareContextType {
  items: CompareItem[];
  addToCompare: (item: CompareItem) => boolean;
  removeFromCompare: (id: number) => void;
  toggleCompare: (item: CompareItem) => void;
  isInCompare: (id: number) => boolean;
  clearCompare: () => void;
  maxItems: number;
}

const MAX_COMPARE_ITEMS = 4;
const STORAGE_KEY = "enduro_compare_items";

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Восстановление из LocalStorage при первой загрузке
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Ошибка чтения списка сравнения из localStorage", e);
    }
  }, []);

  // Синхронизация с LocalStorage при изменении items
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Ошибка сохранения списка сравнения в localStorage", e);
    }
  }, [items, isMounted]);

  const isInCompare = (id: number) => {
    return items.some((item) => item.id === id);
  };

  const addToCompare = (item: CompareItem): boolean => {
    if (isInCompare(item.id)) {
      return false;
    }
    if (items.length >= MAX_COMPARE_ITEMS) {
      message.warning(`Можно сравнивать максимум ${MAX_COMPARE_ITEMS} мотоцикла одновременно`);
      return false;
    }
    setItems((prev) => [...prev, item]);
    message.success(`Мотоцикл «${item.title}» добавлен к сравнению`);
    return true;
  };

  const removeFromCompare = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCompare = (item: CompareItem) => {
    if (isInCompare(item.id)) {
      removeFromCompare(item.id);
      message.info(`«${item.title}» удален из сравнения`);
    } else {
      addToCompare(item);
    }
  };

  const clearCompare = () => {
    setItems([]);
    message.info("Список сравнения очищен");
  };

  return (
    <CompareContext.Provider
      value={{
        items,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        maxItems: MAX_COMPARE_ITEMS,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
