"use client";

import { Descriptions, Typography } from "antd";

const { Title } = Typography;

export interface SpecsProps {
  capacity: string;
  type: string;
  power: string;
  engine: string;
  cooling: string;
  fuelSupply: string;
  fuelTank: string;
  frontSuspension: string;
  rearSuspension: string;
  starter: string;
  frontBrakes: string;
  rearBrakes: string;
  wheels: string;
  dimensions: string;
  wheelbase: string;
  seatHeight: string;
  weight: string;
  clearance: string;
  clutch: string;
  pts: string;
}

export const MotorcycleSpecs = ({ specs }: { specs: SpecsProps }) => {
  return (
    <div style={{ marginBottom: 40 }}>
      <Title level={3} style={{ marginBottom: 24 }}>Характеристики</Title>
      
      <Descriptions 
        bordered 
        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
        size="middle"
      >
        <Descriptions.Item label="Кубатура, куб.см">{specs.capacity}</Descriptions.Item>
        <Descriptions.Item label="Тип">{specs.type}</Descriptions.Item>
        <Descriptions.Item label="Мощность, л.с.">{specs.power}</Descriptions.Item>
        <Descriptions.Item label="Емкость бака, л.">{specs.fuelTank}</Descriptions.Item>
        
        <Descriptions.Item label="Двигатель" span={2}>{specs.engine}</Descriptions.Item>
        
        <Descriptions.Item label="Охлаждение">{specs.cooling}</Descriptions.Item>
        <Descriptions.Item label="Система подачи топлива">{specs.fuelSupply}</Descriptions.Item>
        <Descriptions.Item label="Сцепление">{specs.clutch}</Descriptions.Item>
        <Descriptions.Item label="Стартер">{specs.starter}</Descriptions.Item>
        
        <Descriptions.Item label="Передняя подвеска" span={2}>{specs.frontSuspension}</Descriptions.Item>
        <Descriptions.Item label="Задняя подвеска" span={2}>{specs.rearSuspension}</Descriptions.Item>
        
        <Descriptions.Item label="Передний тормоз">{specs.frontBrakes}</Descriptions.Item>
        <Descriptions.Item label="Задний тормоз">{specs.rearBrakes}</Descriptions.Item>
        <Descriptions.Item label="Колеса">{specs.wheels}</Descriptions.Item>
        <Descriptions.Item label="База, мм">{specs.wheelbase}</Descriptions.Item>
        
        <Descriptions.Item label="Длина*Ширина*Высота, мм" span={2}>{specs.dimensions}</Descriptions.Item>
        
        <Descriptions.Item label="Высота по седлу, мм">{specs.seatHeight}</Descriptions.Item>
        <Descriptions.Item label="Клиренс, мм">{specs.clearance}</Descriptions.Item>
        <Descriptions.Item label="Вес, кг">{specs.weight}</Descriptions.Item>
        <Descriptions.Item label="ПТС">{specs.pts}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};