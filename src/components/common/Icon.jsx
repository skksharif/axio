import * as LucideIcons from 'lucide-react';

export function Icon({ name, size = 20, strokeWidth = 1.75, color = 'currentColor', className = '' }) {
  const LucideIcon = LucideIcons[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} strokeWidth={strokeWidth} color={color} className={className} />;
}
