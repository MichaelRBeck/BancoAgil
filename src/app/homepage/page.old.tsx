import { Suspense } from 'react';
import Homepage from '../../pages/homepage';

export default function HomepageWrapper() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Homepage />
    </Suspense>
  );
}
