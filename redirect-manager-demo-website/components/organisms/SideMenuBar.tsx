'use client';

import { useState } from 'react';
import { BackButton } from '@/components/atoms/BackButton';
import { MenuIcon } from '@/components/atoms/MenuIcon';
import { MenuList, MenuListItem } from '@/components/molecules/MenuList';

export interface SideMenuBarProps {
  title?: string;
  items: MenuListItem[];
  onBack?: () => void;
  backHref?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

export function SideMenuBar({
  title = 'Menu',
  items,
  onBack,
  backHref,
  isOpen: controlledIsOpen,
  onToggle,
  className = ''
}: Readonly<SideMenuBarProps>) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = onToggle || setInternalIsOpen;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      {!isOpen && (<button
          onClick={toggleMenu}
          className="fixed top-22 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border md:hidden"
          aria-label="Toggle menu"
      >
        <MenuIcon isOpen={isOpen}/>
      </button>)}

      {/* Overlay for mobile */}
      {isOpen && (
        <button
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden cursor-default"
          onClick={toggleMenu}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              toggleMenu();
            }
          }}
          aria-label="Close menu overlay"
        />
      )}

      {/* Side menu */}
      <aside
        className={`
          fixed top-18 left-0 z-40 h-screen w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:shadow-none md:border-r md:border-gray-200
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={toggleMenu}
            className="p-1 hover:bg-gray-100 rounded md:hidden"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Back button */}
        {(onBack || backHref) && (
          <div className="p-4 border-b border-gray-200">
            <BackButton
              onClick={onBack}
              href={backHref}
            />
          </div>
        )}

        {/* Menu items */}
        <div className="flex-1 overflow-y-auto">
          <MenuList items={items} className="p-2" />
        </div>
      </aside>
    </>
  );
}
