"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Doctor } from '@/types';
import Image from 'next/image';

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
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search Symptoms, Doctors, Specialists, Clinics"
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          data-testid="autocomplete-input"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
             <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
           </svg>
        </div>
      </div>
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-72 overflow-auto">
          {suggestions.map((doctor) => (
            <li
              key={doctor.id}
              onClick={() => handleSuggestionClick(doctor.name)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-3"
              data-testid="suggestion-item"
            >
               <Image 
                  src={doctor.photo ? doctor.photo : '/placeholder-doctor.png'} 
                  alt={`Dr. ${doctor.name}`} 
                  width={40}
                  height={40} 
                  className="rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="font-medium text-sm text-gray-800">{doctor.name}</div>
                  <div className="text-xs text-gray-500">
                    {doctor.specialities.map(s => s.name).join(', ') || 'Specialty not listed'}
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 