import React from 'react';

export interface CargoMaterialProps {
  cargoType: string;
  wireframe?: boolean;
}

export function getCargoColor(cargoType: string): string {
  const norm = cargoType.toLowerCase();
  if (norm.includes('coking')) {
    return '#212529'; // dark charcoal
  }
  if (norm.includes('thermal') || norm.includes('coal')) {
    return '#151719'; // black/dark gray
  }
  if (norm.includes('iron') || norm.includes('ore')) {
    return '#842A1C'; // brown/red
  }
  if (norm.includes('limestone')) {
    return '#CBD5E1'; // light gray
  }
  if (norm.includes('dolomite')) {
    return '#E2E8F0'; // gray-white
  }
  if (norm.includes('manganese')) {
    return '#34495E'; // dark metallic gray
  }
  return '#2C3E50'; // default industrial mineral
}

export function getCargoRoughness(cargoType: string): number {
  const norm = cargoType.toLowerCase();
  if (norm.includes('manganese')) return 0.4;
  if (norm.includes('limestone') || norm.includes('dolomite')) return 0.85;
  return 0.95; // granular coal/iron ore
}

export function getCargoMetalness(cargoType: string): number {
  const norm = cargoType.toLowerCase();
  if (norm.includes('manganese')) return 0.6;
  if (norm.includes('iron')) return 0.2;
  return 0.05;
}

export const CargoMaterial: React.FC<CargoMaterialProps> = ({ cargoType, wireframe = false }) => {
  const color = getCargoColor(cargoType);
  const roughness = getCargoRoughness(cargoType);
  const metalness = getCargoMetalness(cargoType);

  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      wireframe={wireframe}
      flatShading
    />
  );
};
