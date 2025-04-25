import Image from 'next/image';
import { Doctor } from '@/types';

interface DoctorCardProps {
  doctor: Doctor;
}

// Helper function to extract number from string (e.g., "₹ 500" -> 500, "13 Years..." -> 13)
const extractNumber = (str: string): number => {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

// Helper function to get a safe image source URL
const getSafeImageSrc = (photoUrl: string | null | undefined): string => {
    // Check if photoUrl is a non-empty string and starts with http (basic validation)
    if (typeof photoUrl === 'string' && photoUrl.trim() !== '' && photoUrl.startsWith('http')) {
        return photoUrl;
    }
    // Otherwise, return the placeholder path
    return '/placeholder-doctor.png';
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const experienceYears = extractNumber(doctor.experience);
  const feeAmount = extractNumber(doctor.fees);
  const imageSrc = getSafeImageSrc(doctor.photo);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4 items-start" data-testid="doctor-card">
      <div className="flex-shrink-0">
          <Image 
            src={imageSrc}
            alt={`Dr. ${doctor.name}`}
            width={80} 
            height={80}
            className="rounded-full object-cover border"
          />
      </div>
      <div className="flex-grow">
        <h4 className="text-lg font-semibold text-blue-600" data-testid="doctor-name">{doctor.name}</h4>
        <p className="text-sm text-gray-600" data-testid="doctor-specialty">
          {doctor.specialities.map(spec => spec.name).join(', ')}
        </p>
        <p className="text-sm text-gray-500 mt-1" data-testid="doctor-experience">
          {experienceYears} yrs exp.
        </p>
        <p className="text-sm text-gray-500 mt-1">
            {doctor.clinic.name} - {doctor.clinic.address.locality}
        </p>
        <div className="flex justify-between items-center mt-2">
            <span className="text-base font-semibold text-green-600" data-testid="doctor-fee">
              ₹{feeAmount}
            </span>
            {/* Basic availability indicators */}
            <div className='text-xs space-x-2'>
              {doctor.in_clinic && <span className='bg-blue-100 text-blue-700 px-2 py-1 rounded'>In-Clinic</span>}
              {doctor.video_consult && <span className='bg-purple-100 text-purple-700 px-2 py-1 rounded'>Video</span>}
            </div>
        </div>
      </div>
        {/* Book Appointment Button (Placeholder styling) */}
        <div className="w-full sm:w-auto mt-4 sm:mt-0 flex-shrink-0 self-center sm:self-end">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">
                Book Appointment
            </button>
        </div>
    </div>
  );
} 