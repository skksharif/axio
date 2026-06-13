import { Icon } from './Icon';
import './IconBadge.css';

export function IconBadge({ name, children, size = 'md', iconSize, className = '', style, ...props }) {
  // Standardize visual footprint: ignore size variations for section headers
  const finalIconSize = iconSize ?? 15;
  const icon = name ? <Icon name={name} size={finalIconSize} /> : children;

  return (
    <div
      className={['icon-badge', className].filter(Boolean).join(' ')}
      style={style}
      {...props}
    >
      {icon}
    </div>
  );
}
