"use client";

import React from "react";
import { Button, Tooltip } from "antd";
import { SwapOutlined, CheckOutlined } from "@ant-design/icons";
import { useCompare, type CompareItem } from "../model/compare-context";

interface CompareButtonProps {
  item: CompareItem;
  size?: "small" | "middle" | "large";
  variant?: "icon-only" | "full";
  style?: React.CSSProperties;
}

export const CompareButton: React.FC<CompareButtonProps> = ({
  item,
  size = "middle",
  variant = "full",
  style,
}) => {
  const { isInCompare, toggleCompare } = useCompare();
  const inCompare = isInCompare(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(item);
  };

  if (variant === "icon-only") {
    return (
      <Tooltip title={inCompare ? "Удалить из сравнения" : "Добавить к сравнению"}>
        <Button
          size={size}
          type={inCompare ? "primary" : "default"}
          shape="circle"
          icon={inCompare ? <CheckOutlined /> : <SwapOutlined />}
          onClick={handleClick}
          style={style}
        />
      </Tooltip>
    );
  }

  return (
    <Button
      size={size}
      type={inCompare ? "primary" : "default"}
      icon={inCompare ? <CheckOutlined /> : <SwapOutlined />}
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        ...style,
      }}
    >
      {inCompare ? "В сравнении" : "Сравнить"}
    </Button>
  );
};
