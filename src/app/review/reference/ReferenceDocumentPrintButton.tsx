'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ReferenceDocumentPrintButton() {
  function handlePrint() {
    window.print();
  }

  return (
    <Button type='button' variant='outline' onClick={handlePrint}>
      <Printer className='h-4 w-4' />
      Print / Save as PDF
    </Button>
  );
}
