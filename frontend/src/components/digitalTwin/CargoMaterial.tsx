import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface CargoMaterialProps {
  cargoType: string;
  wireframe?: boolean;
  hasAlert?: boolean;
}

/**
 * Creates a procedural rock/gravel tangent-space normal map
 * to give bulk commodities (like Coking Coal) genuine physical roughness
 * and specular highlights that catch directional and environment lighting.
 */
let cachedGravelTexture: THREE.CanvasTexture | null = null;

export function getGravelNormalTexture(): THREE.CanvasTexture {
  if (cachedGravelTexture) {
    return cachedGravelTexture;
  }

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // 1. Generate height noise
  const heightMap: number[][] = [];
  for (let y = 0; y < size; y++) {
    heightMap[y] = [];
    for (let x = 0; x < size; x++) {
      // Multi-frequency noise for gravel/pebble texture
      const n1 = Math.sin((x / size) * Math.PI * 16) * Math.cos((y / size) * Math.PI * 16);
      const n2 = Math.sin((x / size) * Math.PI * 32 + 1.2) * Math.sin((y / size) * Math.PI * 32 + 2.4);
      const n3 = (Math.random() - 0.5) * 0.45;
      heightMap[y][x] = n1 * 0.35 + n2 * 0.25 + n3;
    }
  }

  // 2. Compute Sobel gradients to build normal vector [nx, ny, nz]
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;
  const bumpScale = 3.5;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xPrev = (x - 1 + size) % size;
      const xNext = (x + 1) % size;
      const yPrev = (y - 1 + size) % size;
      const yNext = (y + 1) % size;

      const dx = (heightMap[y][xNext] - heightMap[y][xPrev]) * bumpScale;
      const dy = (heightMap[yNext][x] - heightMap[yPrev][x]) * bumpScale;
      const dz = 1.0;

      // Normalize
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = -dx / len;
      const ny = -dy / len;
      const nz = dz / len;

      const idx = (y * size + x) * 4;
      data[idx] = Math.floor((nx * 0.5 + 0.5) * 255);     // R (X)
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255); // G (Y)
      data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255); // B (Z)
      data[idx + 3] = 255;                                // A
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;

  cachedGravelTexture = texture;
  return texture;
}

export function getCargoColor(cargoType: string): string {
  const norm = cargoType.toLowerCase();
  if (norm.includes('coking') || norm.includes('coal')) {
    // Dark grey for realistic bulk coking coal (not pitch black)
    return '#282C34';
  }
  if (norm.includes('thermal')) {
    return '#22252B';
  }
  if (norm.includes('iron') || norm.includes('ore')) {
    return '#842A1C'; // brown/red hematite
  }
  if (norm.includes('limestone')) {
    return '#D1D5DB'; // light gray
  }
  if (norm.includes('dolomite')) {
    return '#E5E7EB'; // gray-white
  }
  if (norm.includes('manganese')) {
    return '#374151'; // dark metallic gray
  }
  return '#333A42'; // default bulk mineral
}

export function getCargoRoughness(cargoType: string): number {
  const norm = cargoType.toLowerCase();
  if (norm.includes('manganese')) return 0.5;
  if (norm.includes('limestone') || norm.includes('dolomite')) return 0.85;
  return 0.9; // Coking coal: 0.9 roughness as requested
}

export function getCargoMetalness(cargoType: string): number {
  const norm = cargoType.toLowerCase();
  if (norm.includes('manganese')) return 0.6;
  if (norm.includes('iron')) return 0.2;
  return 0.12; // Subtle micro-specular sheen
}

export const CargoMaterial: React.FC<CargoMaterialProps> = ({
  cargoType,
  wireframe = false,
  hasAlert = false
}) => {
  const color = getCargoColor(cargoType);
  const roughness = getCargoRoughness(cargoType);
  const metalness = getCargoMetalness(cargoType);
  const normalMap = useMemo(() => getGravelNormalTexture(), []);

  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      normalMap={normalMap}
      normalScale={new THREE.Vector2(0.85, 0.85)}
      wireframe={wireframe}
      emissive={hasAlert ? '#7F1D1D' : '#000000'}
      emissiveIntensity={hasAlert ? 0.45 : 0.0}
    />
  );
};
