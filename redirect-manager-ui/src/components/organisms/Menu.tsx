import React, { useState, useRef, useEffect } from 'react';

export interface MenuItem {
  label?: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  trigger: React.ReactNode;
  position?: 'left' | 'right';
}

const Menu: React.FC<MenuProps> = ({
  items,
  trigger,
  position = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const positionClasses = position === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative inline-block" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute ${positionClasses} mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 py-1 z-50`}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="my-1 border-t border-gray-200" />;
            }

            const ItemContent = (
              <>
                {item.icon && <span className="mr-3">{item.icon}</span>}
                <span>{item.label}</span>
              </>
            );

            const itemClasses = `flex items-center w-full px-4 py-2 text-sm text-left transition-colors ${
              item.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
            }`;

            if (item.href && !item.disabled) {
              return (
                <a
                  key={index}
                  href={item.href}
                  className={itemClasses}
                  onClick={() => setIsOpen(false)}
                >
                  {ItemContent}
                </a>
              );
            }

            return (
              <button
                key={index}
                className={itemClasses}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
              >
                {ItemContent}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Menu;
