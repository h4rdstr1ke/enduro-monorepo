import { MotorcyclePage } from "@/pages/motorcycle";

export default function MotorcycleRoute({ params }: { params: { id: string } }) {
  return (
    <main style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '24px' }}>
      <MotorcyclePage motorcycleId={params.id} />
    </main>
  );
}