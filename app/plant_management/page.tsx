import { Suspense } from 'react';
import PlantManagementClient from './plant-management-client';

export default function PlantManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlantManagementClient />
    </Suspense>
  );
}