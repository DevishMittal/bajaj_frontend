"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortOptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSort = searchParams.get('sort') || ''; // Default to no sort

  const [selectedSort, setSelectedSort] = useState(initialSort);

  // Update URL query params for sort
  const updateSortQuery = useCallback((newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort) {
        params.set('sort', newSort);
    } else {
        params.delete('sort'); // Remove sort param if no sort is selected (though UI doesn't have 'none')
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Effect to sync component state with URL
  useEffect(() => {
    setSelectedSort(searchParams.get('sort') || '');
  }, [searchParams]);

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSort = event.target.value;
    // Don't update state directly, rely on useEffect
    updateSortQuery(newSort);
  };

  return (
    <div className="p-4 mb-6 bg-white rounded-md shadow">
      <h3 className="text-lg font-semibold mb-3" data-testid="filter-header-sort">Sort by</h3>
      <div className="space-y-2">
        <div>
          <input
            type="radio"
            id="sort-fees"
            name="sortOption"
            value="fees_asc" // Value indicating fees ascending
            checked={selectedSort === 'fees_asc'}
            onChange={handleSortChange}
            className="mr-2"
            data-testid="sort-fees"
          />
          <label htmlFor="sort-fees">Price: Low-High</label>
        </div>
        <div>
          <input
            type="radio"
            id="sort-experience"
            name="sortOption"
            value="exp_desc" // Value indicating experience descending
            checked={selectedSort === 'exp_desc'}
            onChange={handleSortChange}
            className="mr-2"
            data-testid="sort-experience"
          />
          <label htmlFor="sort-experience">Experience: Most Experience first</label>
        </div>
      </div>
    </div>
  );
} 