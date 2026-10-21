import { MotorcyclePage } from "@/views/motorcycle";
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
        <h2>Мотоцикл не найден</h2>
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