import { Breadcrumb, Flex } from "antd";
import Link from "next/link";
import { MotorcycleOverview } from "@/widgets/motorcycle-overview";
import { MotorcycleSpecs } from "@/widgets/motorcycle-specs";
import type { Motorcycle } from "@/shared/ui/types";

interface MotorcyclePageProps {
  motorcycle: Motorcycle;
}

export const MotorcyclePage = ({ motorcycle }: MotorcyclePageProps) => {
  // Форматируем цену
  const priceStr = motorcycle.price?.average 
    ? `${motorcycle.price.average.toLocaleString('ru-RU')} ₽` 
    : "Нет данных";

  // Маппинг данных
  const mappedSpecs = motorcycle.specs ? {
    capacity: String(motorcycle.specs.capacity || "-"),
    type: motorcycle.specs.type || "-",
    power: String(motorcycle.specs.power || "-"),
    engine: motorcycle.specs.engine || "-",
    cooling: motorcycle.specs.cooling || "-",
    fuelSupply: motorcycle.specs.fuelSupply || "-",
    fuelTank: String(motorcycle.specs.fuelTank || "-"),
    frontSuspension: motorcycle.specs.frontSuspension || "-",
    rearSuspension: motorcycle.specs.rearSuspension || "-",
    starter: motorcycle.specs.starter || "-",
    frontBrakes: motorcycle.specs.frontBrakes || "-",
    rearBrakes: motorcycle.specs.rearBrakes || "-",
    wheels: motorcycle.specs.wheels || "-",
    dimensions: motorcycle.specs.dimensions || "-",
    wheelbase: String(motorcycle.specs.wheelbase || "-"),
    seatHeight: String(motorcycle.specs.seatHeight || "-"),
    weight: String(motorcycle.specs.weight || "-"),
    clearance: String(motorcycle.specs.clearance || "-"),
    clutch: motorcycle.specs.clutch || "-",
    pts: motorcycle.specs.pts ? "Есть" : "Нет"
  } : null;

  return (
    <Flex vertical style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Breadcrumb
        items={[
          { title: <Link href="/">Главная</Link> },
          { title: <Link href="/">Каталог</Link> },
          { title: motorcycle.title },
        ]}
        style={{ marginBottom: 24 }}
      />

      <MotorcycleOverview 
        title={motorcycle.title}
        image={motorcycle.image || "https://placehold.co/800x600?text=Нет+фото"}
        price={priceStr}
        status={motorcycle.status || "В наличии"}
      />

      {mappedSpecs && <MotorcycleSpecs specs={mappedSpecs} />}
    </Flex>
  );
};