"use client";

import React from "react";
import { Button, Flex, Typography, Tag } from "antd";
import { CloseOutlined, SwapOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "../model/compare-context";

const { Text } = Typography;

export const CompareFloatingBar: React.FC = () => {
  const { items, removeFromCompare, clearCompare, maxItems } = useCompare();
  const pathname = usePathname();

  // Не показываем плашку, если список пуст или пользователь уже на странице /compare
  if (items.length === 0 || pathname === "/compare") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "90%",
        maxWidth: 880,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: "12px 20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)",
        border: "1px solid #fa8c16",
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
        {/* Инфо и превью */}
        <Flex align="center" gap="middle" wrap="wrap">
          <Flex vertical>
            <Text strong style={{ fontSize: 14 }}>
              Сравнение моделей
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {items.length} из {maxItems}
            </Text>
          </Flex>

          <Flex gap="small" wrap="wrap" align="center">
            {items.map((item) => (
              <Tag
                key={item.id}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  removeFromCompare(item.id);
                }}
                closeIcon={<CloseOutlined style={{ fontSize: 10 }} />}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 8px",
                  fontSize: 13,
                  backgroundColor: "#fff7e6",
                  borderColor: "#ffd591",
                  borderRadius: 6,
                }}
              >
                {item.image && (
                  <img
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `http://localhost:8080${item.image}`
                    }
                    alt={item.title}
                    style={{
                      width: 24,
                      height: 24,
                      objectFit: "contain",
                      borderRadius: 3,
                    }}
                  />
                )}
                <span
                  style={{
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={item.title}
                >
                  {item.title}
                </span>
              </Tag>
            ))}
          </Flex>
        </Flex>

        {/* Действия */}
        <Flex align="center" gap="small">
          <Button
            type="text"
            danger
            size="middle"
            icon={<DeleteOutlined />}
            onClick={clearCompare}
          >
            Очистить
          </Button>
          <Link href="/compare">
            <Button
              type="primary"
              size="middle"
              icon={<SwapOutlined />}
              style={{ fontWeight: 600 }}
            >
              Сравнить {items.length > 1 ? `(${items.length})` : ""}
            </Button>
          </Link>
        </Flex>
      </Flex>
    </div>
  );
};
