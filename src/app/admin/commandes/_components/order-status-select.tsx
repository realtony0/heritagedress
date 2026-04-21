'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  orderId: number;
  current: string;
  options: string[];
};

export function OrderStatusSelect({ orderId, current, options }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [pending, startTransition] = useTransition();

  const handleChange = async (next: string) => {
    const previous = value;
    setValue(next);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!response.ok) {
        setValue(previous);
        return;
      }
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setValue(previous);
    }
  };

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(event) => handleChange(event.target.value)}
      className={cn(
        'mono-label border bg-white px-3 py-2 text-ink focus:outline-none',
        value === 'nouveau'
          ? 'border-terracotta text-terracotta'
          : 'border-ink/25 text-ink/80',
      )}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
