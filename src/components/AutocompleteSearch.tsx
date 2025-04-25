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
    // Preserve other params, construct new URL
    router.push(`/?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);


  // Effect to update suggestions based on searchTerm
  useEffect(() => {
    if (searchTerm.trim().length > 0 && isFocused) {
      const filtered = doctors
        .filter(doctor =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 3); // Limit to top 3 suggestions
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, doctors, isFocused]);

  // Effect to sync component state with URL on mount/back/forward navigation
   useEffect(() => {
     setSearchTerm(searchParams.get('search') || '');
   }, [searchParams]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (doctorName: string) => {
    setSearchTerm(doctorName);
    setSuggestions([]);
    setIsFocused(false);
    updateSearchQuery(doctorName);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSuggestions([]);
      setIsFocused(false);
       updateSearchQuery(searchTerm);
    }
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
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder="Search Symptoms, Doctors, Specialists, Clinics"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        data-testid="autocomplete-input"
      />
      {suggestions.length > 0 && (
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