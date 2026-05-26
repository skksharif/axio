/**
 * Lightweight className utility — joins truthy class strings.
 * Usage: cn('base', condition && 'modifier', styles.block)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
