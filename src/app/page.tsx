import { fetchDoctors } from "@/lib/api";
import AutocompleteSearch from "@/components/AutocompleteSearch";
import FilterPanel from "@/components/FilterPanel";
import SortOptions from "@/components/SortOptions";
import DoctorList from "@/components/DoctorList";
import { Suspense } from "react";
import { Doctor } from "@/types"; // Import Doctor type

// Wrapper component to handle Suspense for client components using searchParams
function ClientComponentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      {children}
    </Suspense>
  );
}

// Helper function to extract unique specialties
const getUniqueSpecialties = (doctors: Doctor[]): string[] => {
    const specialtiesSet = new Set<string>();
    doctors.forEach(doctor => {
        doctor.specialities.forEach(spec => specialtiesSet.add(spec.name));
    });
    return Array.from(specialtiesSet);
};

export default async function Home() {
  const doctors = await fetchDoctors();
  const allSpecialties = getUniqueSpecialties(doctors);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      {/* Blue Header */}
      <header className="w-full bg-blue-600 p-4 shadow-md sticky top-0 z-20">
          <div className="w-full max-w-5xl mx-auto"> {/* Centering container */} 
              <ClientComponentWrapper>
                  <AutocompleteSearch doctors={doctors} />
              </ClientComponentWrapper>
          </div>
      </header>
      
      {/* Main content area with padding */}
      <div className="w-full max-w-5xl p-4 md:p-8"> {/* Add padding here */} 
          {/* Filters and List */}
          <div className="flex flex-col md:flex-row gap-8 mt-6"> {/* Added mt-6 here */} 
            <aside className="w-full md:w-1/4 space-y-6"> {/* Added space-y-6 */} 
              {/* Sort Options now inside aside */}
              <ClientComponentWrapper>
                  <SortOptions />
              </ClientComponentWrapper>
              
              {/* Filter Panel */}
              <ClientComponentWrapper>
                  <FilterPanel allSpecialties={allSpecialties} /> 
              </ClientComponentWrapper>
            </aside>
  
            <section className="w-full md:w-3/4">
               <ClientComponentWrapper>
                   <DoctorList doctors={doctors} />
               </ClientComponentWrapper>
            </section>
          </div>
        </div>
    </main>
  );
}
