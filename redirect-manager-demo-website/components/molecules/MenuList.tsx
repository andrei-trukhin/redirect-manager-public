import { MenuItem } from '@/components/atoms/MenuItem';

export interface MenuListItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface MenuListProps {
  items: MenuListItem[];
  className?: string;
}

export function MenuList({ items, className = '' }: Readonly<MenuListProps>) {
  return (
    <nav className={`space-y-1 ${className}`}>
      {items.map((item, index) => (
        <MenuItem
          key={`${item.href}-${index}`}
          href={item.href}
          isActive={item.isActive}
        >
          {item.label}
        </MenuItem>
      ))}
    </nav>
  );
}
