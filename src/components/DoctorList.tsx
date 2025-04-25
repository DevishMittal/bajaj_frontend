"use client";

import { useSearchParams } from 'next/navigation';
import { Doctor } from '@/types';
import DoctorCard from './DoctorCard';
import { useMemo } from 'react';

interface DoctorListProps {
  doctors: Doctor[];
}

// Helper function to extract number from string (e.g., "₹ 500" -> 500, "13 Years..." -> 13)
const extractNumber = (str: string): number => {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

export default function DoctorList({ doctors }: DoctorListProps) {
  const searchParams = useSearchParams();

  const filteredAndSortedDoctors = useMemo(() => {
    const search = searchParams.get('search') || '';
    const mode = searchParams.get('mode') || 'all';
    const specialtiesParam = searchParams.get('specialties') || '';
    const selectedSpecialties = specialtiesParam ? specialtiesParam.split(',') : [];
    const sort = searchParams.get('sort') || '';

    let processedDoctors = [...doctors];

    // 1. Filter by Search Term
    if (search) {
        processedDoctors = processedDoctors.filter(doctor => 
            doctor.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // 2. Filter by Mode
    if (mode === 'video') {
        processedDoctors = processedDoctors.filter(doctor => doctor.video_consult);
    } else if (mode === 'in_clinic') {
        processedDoctors = processedDoctors.filter(doctor => doctor.in_clinic);
    }
    // 'all' requires no mode filtering

    // 3. Filter by Specialties (must match ALL selected specialties)
    if (selectedSpecialties.length > 0) {
        processedDoctors = processedDoctors.filter(doctor => {
            const doctorSpecialties = doctor.specialities.map(s => s.name);
            return selectedSpecialties.every(selSpec => doctorSpecialties.includes(selSpec));
            // If you wanted ANY match: return selectedSpecialties.some(selSpec => doctorSpecialties.includes(selSpec));
        });
    }

    // 4. Sort
    if (sort === 'fees_asc') {
        processedDoctors.sort((a, b) => extractNumber(a.fees) - extractNumber(b.fees));
    } else if (sort === 'exp_desc') {
        processedDoctors.sort((a, b) => extractNumber(b.experience) - extractNumber(a.experience));
    }

    return processedDoctors;

  }, [doctors, searchParams]);


  return (
    <div className="space-y-4">
      {filteredAndSortedDoctors.length > 0 ? (
        filteredAndSortedDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))
      ) : (
        <p className="text-center text-gray-500 py-6">No doctors found matching your criteria.</p>
      )}
    </div>
  );
} 