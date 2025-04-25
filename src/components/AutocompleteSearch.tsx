"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Doctor } from '@/types';

interface AutocompleteSearchProps {
  doctors: Doctor[];
}

export default function AutocompleteSearch({ doctors }: AutocompleteSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // Update URL query params
  const updateSearchQuery = useCallback((newSearchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearchTerm) {
      params.set('search', newSearchTerm);
    } else {
      params.delete('search');
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);


  // Effect to calculate suggestions based only on searchTerm
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = doctors
        .filter(doctor =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 3);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  // Only re-run calculation when searchTerm or doctors change
  }, [searchTerm, doctors]); 

  // Effect to sync component state with URL on mount/back/forward navigation
   useEffect(() => {
     setSearchTerm(searchParams.get('search') || '');
   }, [searchParams]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (doctorName: string) => {
    setSearchTerm(doctorName); 
    // No need to manually set suggestions here, useEffect will handle it based on new searchTerm
    setIsFocused(false); // Hide suggestions immediately
    updateSearchQuery(doctorName);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // No need to manually set suggestions here
      setIsFocused(false); // Hide suggestions
      updateSearchQuery(searchTerm); 
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click event on suggestions
    setTimeout(() => {
        setIsFocused(false);
    }, 150);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus} // Use dedicated handler
        onBlur={handleBlur}
        placeholder="Search Symptoms, Doctors, Specialists, Clinics"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        data-testid="autocomplete-input"
      />
      {/* Only show suggestions if focused and suggestions exist */}
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((doctor) => (
            <li
              key={doctor.id}
              onClick={() => handleSuggestionClick(doctor.name)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              data-testid="suggestion-item"
            >
              {doctor.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 