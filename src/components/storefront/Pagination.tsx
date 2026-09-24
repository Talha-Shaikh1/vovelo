'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber <= 1) {
      params.delete('page');
    } else {
      params.set('page', pageNumber.toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  // Generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-[#E4E4E0] mt-10">
      {/* Items count summary */}
      <p className="text-xs text-[#666660] font-medium order-2 sm:order-1">
        Showing <span className="font-bold text-[#111111]">{startItem}</span>–
        <span className="font-bold text-[#111111]">{endItem}</span> of{' '}
        <span className="font-bold text-[#111111]">{totalItems.toLocaleString()}</span> items
      </p>

      {/* Pagination Controls */}
      <nav
        aria-label="Pagination Navigation"
        className="flex items-center gap-1 order-1 sm:order-2"
      >
        {/* First Page */}
        {currentPage > 2 && (
          <Link
            href={createPageUrl(1)}
            className="p-2 rounded-lg text-[#666660] hover:text-[#111111] hover:bg-[#F0F0EC] transition-colors"
            title="First Page"
            aria-label="Go to first page"
          >
            <ChevronsLeft size={16} />
          </Link>
        )}

        {/* Prev Page Button */}
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="p-2 rounded-lg text-[#111111] hover:bg-[#F0F0EC] border border-[#E4E4E0] transition-colors flex items-center gap-1 text-xs font-semibold mr-1"
            aria-label="Previous page"
          >
            <ChevronLeft size={15} />
            <span className="hidden sm:inline">Prev</span>
          </Link>
        ) : (
          <span className="p-2 rounded-lg text-[#999990] border border-[#E4E4E0]/60 opacity-40 cursor-not-allowed flex items-center gap-1 text-xs font-semibold mr-1">
            <ChevronLeft size={15} />
            <span className="hidden sm:inline">Prev</span>
          </span>
        )}

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-[#666660] select-none"
                >
                  •••
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <Link
                key={page}
                href={createPageUrl(page)}
                className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'bg-white text-[#111111] hover:bg-[#F0F0EC] border border-[#E4E4E0]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {/* Next Page Button */}
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="p-2 rounded-lg text-[#111111] hover:bg-[#F0F0EC] border border-[#E4E4E0] transition-colors flex items-center gap-1 text-xs font-semibold ml-1"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={15} />
          </Link>
        ) : (
          <span className="p-2 rounded-lg text-[#999990] border border-[#E4E4E0]/60 opacity-40 cursor-not-allowed flex items-center gap-1 text-xs font-semibold ml-1">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={15} />
          </span>
        )}

        {/* Last Page */}
        {currentPage < totalPages - 1 && (
          <Link
            href={createPageUrl(totalPages)}
            className="p-2 rounded-lg text-[#666660] hover:text-[#111111] hover:bg-[#F0F0EC] transition-colors"
            title="Last Page"
            aria-label="Go to last page"
          >
            <ChevronsRight size={16} />
          </Link>
        )}
      </nav>
    </div>
  );
}
