"use client"

import { Checkbox, Typography, Divider, Space } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import type { Brand } from "@/shared/ui/types";
import { useEffect, useState } from "react";

const { Title } = Typography;

interface CatalogSidebarProps {
  brands: Brand[];
}

export const CatalogSidebar = ({ brands }: CatalogSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);

  // Инициализируем стейт из URL
  useEffect(() => {
    const brandsParam = searchParams.get("brands");
    if (brandsParam) {
      setSelectedBrands(brandsParam.split(",").map(Number));
    } else {
      setSelectedBrands([]);
    }
  }, [searchParams]);

  const handleBrandChange = (brandId: number, checked: boolean) => {
    let newBrands = [...selectedBrands];
    if (checked) {
      newBrands.push(brandId);
    } else {
      newBrands = newBrands.filter(id => id !== brandId);
    }

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (newBrands.length > 0) {
      current.set("brands", newBrands.join(","));
    } else {
      current.delete("brands");
    }

    // Pushing new URL to update server component
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/${query}`);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <Title level={4}>Фильтры</Title>
      <Divider style={{ margin: '12px 0' }} />
      
      <Title level={5} style={{ marginBottom: 16 }}>Бренд</Title>
      <Space direction="vertical" style={{ width: '100%', maxHeight: 400, overflowY: 'auto' }}>
        {brands.map((b) => (
          <Checkbox 
            key={b.id} 
            checked={selectedBrands.includes(b.id)}
            onChange={(e) => handleBrandChange(b.id, e.target.checked)}
          >
            {b.name}
          </Checkbox>
        ))}
      </Space>
    </div>
  );
};
