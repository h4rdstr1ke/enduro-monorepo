export interface Motorcycle {
  id: number;
  title: string;
  image: string;
  status: string;
  category: string;
  brand: {
    id: number;
    name: string;
    country: string;
  };
  price?: {
    average: number;
    min: number;
    max: number;
    currency: string;
    minSourceName: string;
    minSourceUrl: string;
    maxSourceName: string;
  };
  specs?: {
    capacity: number;
    type: string;
    power: number;
    engine: string;
    cooling: string;
    fuelSupply: string;
    fuelTank: number;
    frontSuspension: string;
    rearSuspension: string;
    starter: string;
    frontBrakes: string;
    rearBrakes: string;
    wheels: string;
    dimensions: string;
    wheelbase: number;
    seatHeight: number;
    weight: number;
    clearance: number;
    clutch: string;
    pts: boolean;
  };
}

export interface Brand { 
  id: number; 
  name: string; 
  country: string; 
  description?: string;
  logoUrl?: string;
  motorcycles?: Motorcycle[];
}
