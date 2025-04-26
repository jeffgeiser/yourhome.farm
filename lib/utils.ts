import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatString: string = 'PPP'): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getPlantStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'healthy':
      return 'bg-green-500';
    case 'struggling':
      return 'bg-yellow-500';
    case 'pest problem':
      return 'bg-red-500';
    case 'disease':
      return 'bg-red-500';
    case 'dormant':
      return 'bg-gray-500';
    default:
      return 'bg-blue-500';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}