"use client"
import { Breadcrumb, Flex } from "antd";
import { MotorcycleOverview } from "@/widgets/motorcycle-overview";
import { MotorcycleSpecs } from "@/widgets/motorcycle-specs";

import type { SpecsProps } from "@/widgets/motorcycle-specs/ui/motorcycle-specs";

// В будущем данные будут загружаться сервером и передаваться через пропсы
const MOCK_BIKE_DETAILS = {
  title: "Эндуро 150",
  image: "https://placehold.co/800x600?text=Enduro+150",
  price: "120 000 ₽",
  status: "В наличии",
  specs: {
    capacity: "150",
    type: "Эндуро",
    power: "12",
    engine: "Одноцилиндровый , 4-тактный Zongshen (ZS161FMJ)",
    cooling: "Воздушное",
    fuelSupply: "Карбюратор NIBBI PE26",
    fuelTank: "10л",
    frontSuspension: "Телескопическая, перевернутого типа, 860 мм (MNT) , нерегулируемая",
    rearSuspension: "Моноамортизатор 450 мм (MNT) (нерегулируемый)",
    starter: "Электрический и кикстартер",
    frontBrakes: "Дисковый гидравлический",
    rearBrakes: "Дисковый гидравлический",
    wheels: "19/16",
    dimensions: "2010×810×1155",
    wheelbase: "1 435",
    seatHeight: "950",
    weight: "116",
    clearance: "250",
    clutch: "Механическое",
    pts: "НЕТ"
  } as SpecsProps
};

interface MotorcyclePageProps {
  motorcycleId: string;
}

export const MotorcyclePage = ({ motorcycleId }: MotorcyclePageProps) => {
  return (
    <Flex vertical style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Breadcrumb
        items={[
          { title: <a href="/">Главная</a> },
          { title: <a href="/">Энциклопедия</a> },
          { title: MOCK_BIKE_DETAILS.title },
        ]}
        style={{ marginBottom: 24 }}
      />

      <MotorcycleOverview 
        title={MOCK_BIKE_DETAILS.title}
        image={MOCK_BIKE_DETAILS.image}
        price={MOCK_BIKE_DETAILS.price}
        status={MOCK_BIKE_DETAILS.status}
      />

      <MotorcycleSpecs specs={MOCK_BIKE_DETAILS.specs} />
    </Flex>
  );
};