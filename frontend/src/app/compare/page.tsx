import { CompareView } from "@/features/compare";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сравнение мотоциклов эндуро | EnduroHelper",
  description: "Сравнение технических характеристик, цен, подвески и двигателей мотоциклов эндуро",
};

export default function ComparePage() {
  return (
    <main style={{ minHeight: "85vh", backgroundColor: "#fafafa" }}>
      <CompareView />
    </main>
  );
}
