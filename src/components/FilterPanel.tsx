"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Function to safely get array from search params
const getArrayFromParams = (params: URLSearchParams, key: string): string[] => {
    const value = params.get(key);
    return value ? value.split(',') : [];
}

interface FilterPanelProps {
  allSpecialties: string[];
}

export default function FilterPanel({ allSpecialties }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for Mode filter
  const initialMode = searchParams.get('mode') || 'all'; 
  const [selectedMode, setSelectedMode] = useState(initialMode);

  // State for Specialties filter
  const initialSpecialties = getArrayFromParams(searchParams, 'specialties');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(initialSpecialties);

  // --- Mode Filter Logic ---
  const updateModeQuery = useCallback((newMode: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newMode && newMode !== 'all') {
        params.set('mode', newMode);
    } else {
        params.delete('mode'); 
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    setSelectedMode(searchParams.get('mode') || 'all');
  }, [searchParams]);

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value;
    // Don't update state here directly, rely on useEffect
    updateModeQuery(newMode);
  };

  // --- Specialties Filter Logic ---
  const updateSpecialtiesQuery = useCallback((newSpecialties: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSpecialties.length > 0) {
        params.set('specialties', newSpecialties.join(','));
    } else {
        params.delete('specialties');
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

   useEffect(() => {
       setSelectedSpecialties(getArrayFromParams(searchParams, 'specialties'));
   }, [searchParams]);

  const handleSpecialtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const specialty = event.target.value;
    const isChecked = event.target.checked;
    let newSelection = [...selectedSpecialties];

    if (isChecked) {
        newSelection.push(specialty);
    } else {
        newSelection = newSelection.filter(s => s !== specialty);
    }
    // Don't update state here directly, rely on useEffect
    updateSpecialtiesQuery(newSelection);
  };


  return (
    <div className="p-4 bg-white rounded-md shadow space-y-6">
       {/* Mode of Consultation Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3" data-testid="filter-header-moc">Mode of consultation</h3>
        <div className="space-y-2">
          {/* Radio buttons remain the same */}
          <div>
             <input type="radio" id="video-consult" name="consultationMode" value="video" checked={selectedMode === 'video'} onChange={handleModeChange} className="mr-2" data-testid="filter-video-consult" />
             <label htmlFor="video-consult">Video Consultation</label>
          </div>
          <div>
             <input type="radio" id="in-clinic" name="consultationMode" value="in_clinic" checked={selectedMode === 'in_clinic'} onChange={handleModeChange} className="mr-2" data-testid="filter-in-clinic" />
             <label htmlFor="in-clinic">In-clinic Consultation</label>
           </div>
           <div>
             <input type="radio" id="all" name="consultationMode" value="all" checked={selectedMode === 'all'} onChange={handleModeChange} className="mr-2" />
             <label htmlFor="all">All</label>
           </div>
        </div>
      </div>

      {/* Specialties Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3" data-testid="filter-header-speciality">Specialities</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2"> {/* Added scroll for long lists */} 
          {allSpecialties.sort().map(specialty => (
            <div key={specialty}>
              <input
                type="checkbox"
                id={`specialty-${specialty}`}
                value={specialty}
                checked={selectedSpecialties.includes(specialty)}
                onChange={handleSpecialtyChange}
                className="mr-2"
                data-testid={`filter-specialty-${specialty.replace(/\/| /g, '-')}`}
              />
              <label htmlFor={`specialty-${specialty}`}>{specialty}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 