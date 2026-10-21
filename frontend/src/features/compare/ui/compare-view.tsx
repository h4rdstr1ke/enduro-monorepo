"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Flex,
  Switch,
  Spin,
  Empty,
  Card,
  Tag,
  Divider,
  Breadcrumb,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  CloseOutlined,
  SwapOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useCompare } from "../model/compare-context";
import type { Motorcycle } from "@/shared/ui/types";

const { Title, Text } = Typography;

interface SpecRowDef {
  key: string;
  label: string;
  getValue: (m: Motorcycle) => string | number | null | undefined;
  unit?: string;
  better?: "max" | "min"; // для подсветки лучшего числового значения
}

interface SpecGroupDef {
  title: string;
  rows: SpecRowDef[];
}

const SPEC_GROUPS: SpecGroupDef[] = [
  {
    title: "Общая информация",
    rows: [
      {
        key: "brand",
        label: "Бренд",
        getValue: (m) => m.brand?.name || "-",
      },
      {
        key: "country",
        label: "Страна бренда",
        getValue: (m) => m.brand?.country || "-",
      },
      {
        key: "price_avg",
        label: "Средняя цена",
        getValue: (m) =>
          m.price?.average ? `${m.price.average.toLocaleString("ru-RU")} ₽` : "-",
      },
      {
        key: "price_range",
        label: "Диапазон цен",
        getValue: (m) => {
          if (!m.price?.min && !m.price?.max) return "-";
          const min = m.price.min ? `${m.price.min.toLocaleString("ru-RU")}` : "";
          const max = m.price.max ? `${m.price.max.toLocaleString("ru-RU")}` : "";
          return `${min} — ${max} ₽`;
        },
      },
      {
        key: "pts",
        label: "Наличие ПТС",
        getValue: (m) => (m.specs?.pts ? "Да (с ПТС)" : "Нет (спортинвентарь)"),
      },
      {
        key: "status",
        label: "Статус",
        getValue: (m) => m.status || "В наличии",
      },
    ],
  },
  {
    title: "Двигатель и трансмиссия",
    rows: [
      {
        key: "capacity",
        label: "Объем двигателя",
        getValue: (m) => m.specs?.capacity,
        unit: "см³",
        better: "max",
      },
      {
        key: "power",
        label: "Мощность",
        getValue: (m) => m.specs?.power,
        unit: "л.с.",
        better: "max",
      },
      {
        key: "engine",
        label: "Модель двигателя",
        getValue: (m) => m.specs?.engine || "-",
      },
      {
        key: "cooling",
        label: "Охлаждение",
        getValue: (m) => m.specs?.cooling || "-",
      },
      {
        key: "fuelSupply",
        label: "Подача топлива",
        getValue: (m) => m.specs?.fuelSupply || "-",
      },
      {
        key: "fuelTank",
        label: "Емкость бака",
        getValue: (m) => m.specs?.fuelTank,
        unit: "л",
        better: "max",
      },
      {
        key: "starter",
        label: "Запуск двигателя",
        getValue: (m) => m.specs?.starter || "-",
      },
      {
        key: "clutch",
        label: "Сцепление",
        getValue: (m) => m.specs?.clutch || "-",
      },
    ],
  },
  {
    title: "Шасси, подвеска и тормоза",
    rows: [
      {
        key: "frontSuspension",
        label: "Передняя подвеска",
        getValue: (m) => m.specs?.frontSuspension || "-",
      },
      {
        key: "rearSuspension",
        label: "Задняя подвеска",
        getValue: (m) => m.specs?.rearSuspension || "-",
      },
      {
        key: "frontBrakes",
        label: "Передние тормоза",
        getValue: (m) => m.specs?.frontBrakes || "-",
      },
      {
        key: "rearBrakes",
        label: "Задние тормоза",
        getValue: (m) => m.specs?.rearBrakes || "-",
      },
      {
        key: "wheels",
        label: "Колеса",
        getValue: (m) => m.specs?.wheels || "-",
      },
    ],
  },
  {
    title: "Габариты и масса",
    rows: [
      {
        key: "weight",
        label: "Сухой вес",
        getValue: (m) => m.specs?.weight,
        unit: "кг",
        better: "min",
      },
      {
        key: "seatHeight",
        label: "Высота по седлу",
        getValue: (m) => m.specs?.seatHeight,
        unit: "мм",
      },
      {
        key: "clearance",
        label: "Дорожный просвет (клиренс)",
        getValue: (m) => m.specs?.clearance,
        unit: "мм",
        better: "max",
      },
      {
        key: "wheelbase",
        label: "Колесная база",
        getValue: (m) => m.specs?.wheelbase,
        unit: "мм",
      },
      {
        key: "dimensions",
        label: "Габариты (ДхШхВ)",
        getValue: (m) => m.specs?.dimensions || "-",
      },
    ],
  },
];

export const CompareView: React.FC = () => {
  const { items, removeFromCompare, clearCompare } = useCompare();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [onlyDifferences, setOnlyDifferences] = useState<boolean>(false);

  useEffect(() => {
    if (items.length === 0) {
      setMotorcycles([]);
      setLoading(false);
      return;
    }

    const ids = items.map((i) => i.id).join(",");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

    setLoading(true);
    fetch(`${apiUrl}/motorcycles?ids=${ids}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки");
        return res.json();
      })
      .then((data: Motorcycle[]) => {
        // Сохраняем исходный порядок из `items`
        const map = new Map(data.map((m) => [m.id, m]));
        const ordered = items
          .map((i) => map.get(i.id))
          .filter((m): m is Motorcycle => Boolean(m));
        setMotorcycles(ordered);
      })
      .catch((err) => {
        console.error("Не удалось загрузить данные для сравнения:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [items]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Загружаем характеристики для сравнения...</Text>
        </div>
      </div>
    );
  }

  if (items.length === 0 || motorcycles.length === 0) {
    return (
      <div style={{ padding: "40px 24px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Flex vertical gap="small">
              <Title level={4}>В списке сравнения пока пусто</Title>
              <Text type="secondary">
                Добавьте от 2 до 4 моделей из каталога, чтобы наглядно сопоставить их характеристики,
                двигатель, клиренс и вес.
              </Text>
            </Flex>
          }
        >
          <Link href="/">
            <Button type="primary" size="large" icon={<ArrowLeftOutlined />}>
              Перейти в каталог
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  // Вспомогательная функция проверки различий в строке
  const hasDifference = (row: SpecRowDef): boolean => {
    if (motorcycles.length <= 1) return false;
    const firstVal = String(row.getValue(motorcycles[0]) ?? "");
    return motorcycles.some((m) => String(row.getValue(m) ?? "") !== firstVal);
  };

  // Поиск лучшего значения для числовых колонок
  const getBestValue = (row: SpecRowDef): number | null => {
    if (!row.better) return null;
    const nums = motorcycles
      .map((m) => {
        const val = row.getValue(m);
        return typeof val === "number" ? val : null;
      })
      .filter((n): n is number => n !== null && n > 0);

    if (nums.length <= 1) return null;
    return row.better === "max" ? Math.max(...nums) : Math.min(...nums);
  };

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px 16px" }}>
      {/* Навигация */}
      <Breadcrumb
        items={[
          { title: <Link href="/">Главная</Link> },
          { title: <Link href="/">Каталог</Link> },
          { title: "Сравнение моделей" },
        ]}
        style={{ marginBottom: 20 }}
      />

      {/* Верхний заголовок и панель управления */}
      <Flex justify="space-between" align="center" wrap="wrap" gap="middle" style={{ marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Сравнение мотоциклов
          </Title>
          <Text type="secondary">
            Сопоставление {motorcycles.length} {motorcycles.length === 1 ? "модели" : "моделей"}
          </Text>
        </div>

        <Flex align="center" gap="large" wrap="wrap">
          <Flex align="center" gap="small">
            <Switch
              checked={onlyDifferences}
              onChange={setOnlyDifferences}
              id="diff-switch"
            />
            <label htmlFor="diff-switch" style={{ cursor: "pointer", userSelect: "none" }}>
              Показывать только различия
            </label>
          </Flex>

          <Button danger type="text" icon={<DeleteOutlined />} onClick={clearCompare}>
            Очистить список
          </Button>

          <Link href="/">
            <Button icon={<SwapOutlined />}>Добавить еще</Button>
          </Link>
        </Flex>
      </Flex>

      {/* Таблица сравнения */}
      <div
        style={{
          overflowX: "auto",
          backgroundColor: "#ffffff",
          borderRadius: 12,
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 700,
          }}
        >
          {/* Заголовки с карточками мотоциклов */}
          <thead>
            <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
              <th
                style={{
                  width: 220,
                  minWidth: 200,
                  padding: "20px 16px",
                  textAlign: "left",
                  verticalAlign: "bottom",
                  backgroundColor: "#fafafa",
                  borderRight: "1px solid #f0f0f0",
                }}
              >
                <Text strong style={{ fontSize: 15, color: "#8c8c8c" }}>
                  Параметры и ТТХ
                </Text>
              </th>

              {motorcycles.map((moto) => (
                <th
                  key={moto.id}
                  style={{
                    padding: "20px 16px",
                    textAlign: "center",
                    verticalAlign: "top",
                    borderRight: "1px solid #f0f0f0",
                    position: "relative",
                  }}
                >
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => removeFromCompare(moto.id)}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      color: "#bfbfbf",
                    }}
                    title="Удалить из сравнения"
                  />

                  {/* Картинка */}
                  <div
                    style={{
                      height: 140,
                      backgroundColor: "#f9f9f9",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                      overflow: "hidden",
                    }}
                  >
                    {moto.image ? (
                      <img
                        src={
                          moto.image.startsWith("http")
                            ? moto.image
                            : `http://localhost:8080${moto.image}`
                        }
                        alt={moto.title}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                          padding: 8,
                        }}
                      />
                    ) : (
                      <Text type="secondary">Нет фото</Text>
                    )}
                  </div>

                  {/* Бренд */}
                  <Link href={`/brand/${moto.brand?.id || ""}`}>
                    <Tag color="orange" style={{ marginBottom: 6 }}>
                      {moto.brand?.name || "Бренд"}
                    </Tag>
                  </Link>

                  {/* Заголовок */}
                  <Title
                    level={5}
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: 15,
                      lineHeight: "1.3",
                    }}
                  >
                    <Link
                      href={`/motorcycle/${moto.id}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {moto.title}
                    </Link>
                  </Title>

                  {/* Цена */}
                  <div style={{ marginTop: 4 }}>
                    <Text strong style={{ color: "#fa8c16", fontSize: 16 }}>
                      {moto.price?.average
                        ? `${moto.price.average.toLocaleString("ru-RU")} ₽`
                        : "Нет данных"}
                    </Text>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Строки спецификаций по группам */}
          <tbody>
            {SPEC_GROUPS.map((group) => {
              // Фильтрация строк, если включен режим "только различия"
              const visibleRows = group.rows.filter((row) =>
                onlyDifferences ? hasDifference(row) : true
              );

              if (visibleRows.length === 0) return null;

              return (
                <React.Fragment key={group.title}>
                  {/* Заголовок группы */}
                  <tr style={{ backgroundColor: "#fafafa" }}>
                    <td
                      colSpan={motorcycles.length + 1}
                      style={{
                        padding: "10px 16px",
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#262626",
                        borderTop: "1px solid #f0f0f0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {group.title}
                    </td>
                  </tr>

                  {/* Строки параметров */}
                  {visibleRows.map((row) => {
                    const isDiff = hasDifference(row);
                    const bestVal = getBestValue(row);

                    return (
                      <tr
                        key={row.key}
                        style={{
                          borderBottom: "1px solid #f5f5f5",
                          backgroundColor: isDiff ? "#fffdfa" : "transparent",
                        }}
                      >
                        {/* Название параметра */}
                        <td
                          style={{
                            padding: "12px 16px",
                            fontSize: 13,
                            color: "#595959",
                            borderRight: "1px solid #f0f0f0",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <Flex align="center" justify="space-between">
                            <span>{row.label}</span>
                            {isDiff && (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  backgroundColor: "#fa8c16",
                                  marginLeft: 4,
                                }}
                                title="Значения различаются"
                              />
                            )}
                          </Flex>
                        </td>

                        {/* Значения по мотоциклам */}
                        {motorcycles.map((moto) => {
                          const rawVal = row.getValue(moto);
                          const isBest =
                            typeof rawVal === "number" &&
                            bestVal !== null &&
                            rawVal === bestVal;

                          const displayVal =
                            rawVal !== null && rawVal !== undefined && rawVal !== ""
                              ? `${rawVal}${row.unit ? ` ${row.unit}` : ""}`
                              : "-";

                          return (
                            <td
                              key={moto.id}
                              style={{
                                padding: "12px 16px",
                                textAlign: "center",
                                fontSize: 13,
                                color: "#262626",
                                borderRight: "1px solid #f0f0f0",
                                fontWeight: isBest ? 600 : 400,
                                backgroundColor: isBest
                                  ? "#f6ffed"
                                  : isDiff
                                  ? "#fffdfa"
                                  : "transparent",
                              }}
                            >
                              <Flex
                                justify="center"
                                align="center"
                                gap="small"
                                style={{
                                  color: isBest ? "#389e0d" : "inherit",
                                }}
                              >
                                {displayVal}
                                {isBest && (
                                  <Tag
                                    color="success"
                                    style={{
                                      margin: 0,
                                      padding: "0 4px",
                                      fontSize: 10,
                                      lineHeight: "16px",
                                    }}
                                  >
                                    лучший
                                  </Tag>
                                )}
                              </Flex>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
