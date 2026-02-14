import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import IconButton from '../atoms/IconButton';
import {Button} from "../atoms";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const generateAllPages = (total: number): number[] => {
    const pages: number[] = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  };

  const generateMobilePages = (current: number, total: number): (number | string)[] => {
    if (current === 1) {
      return [1, 2, '...', total];
    }
    if (current === total) {
      return [1, '...', total - 1, total];
    }
    return [1, '...', current, '...', total];
  };

  const generateDesktopPages = (current: number, total: number): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...', total);
      return pages;
    }

    if (current >= total - 2) {
      pages.push(1, '...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1, '...');
    for (let i = current - 1; i <= current + 1; i++) {
      pages.push(i);
    }
    pages.push('...', total);
    return pages;
  };

  const getPageNumbers = (isMobile: boolean): (number | string)[] => {
    const maxVisible = isMobile ? 3 : 7;

    if (totalPages <= maxVisible) {
      return generateAllPages(totalPages);
    }

    return isMobile
      ? generateMobilePages(currentPage, totalPages)
      : generateDesktopPages(currentPage, totalPages);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-1 sm:gap-2 ${className}`}>
      <IconButton
        onClick={handlePrevious}
        disabled={currentPage === 1}
        title="Previous page"
        size="md"
        className="sm:w-auto"
        icon={<ChevronLeft className="w-5 h-5" />}
      />

      {/* Desktop view: show more pages */}
      <div className="hidden sm:flex items-center gap-1">
        {getPageNumbers(false).map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-desktop-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <Button
                variant={isActive ? 'primary' : 'outline'}
              key={page}
              onClick={() => handlePageClick(page)}
              className={`min-w-10 px-3 py-2 text-sm font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Mobile view: show fewer pages with smaller buttons */}
      <div className="flex sm:hidden items-center gap-0.5">
        {getPageNumbers(true).map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-mobile-${index}`} className="px-1.5 py-2 text-xs text-gray-500">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              size="sm"
              variant={isActive ? 'primary' : 'outline'}
              onClick={() => handlePageClick(page)}
              className={`min-w-10 px-2 py-2 text-xs font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500`}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <IconButton
        onClick={handleNext}
        disabled={currentPage === totalPages}
        title="Next page"
        size="md"
        className="sm:w-auto"
        icon={<ChevronRight className="w-5 h-5" />}
      />
    </div>
  );
};

export default Pagination;
