import { MotorcyclePage } from "@/pages/motorcycle"; // поправь путь до компонента из шага 2, если нужно
import { Typography } from "antd";
import type { Motorcycle } from "@/shared/ui/types";

export default async function MotorcycleRoute({ params }: { params: Promise<{ id: string }> }) {

  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const res = await fetch(`${process.env.API_URL}/motorcycles/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '24px', textAlign: 'center' }}>
        <Typography.Title level={3}>Мотоцикл не найден</Typography.Title>
      </main>
    );
  }

  const motorcycle: Motorcycle = await res.json();

  return (
    <main style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '24px' }}>
      <MotorcyclePage motorcycle={motorcycle} />
    </main>
  );
}