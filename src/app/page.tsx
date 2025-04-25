import { fetchDoctors } from "@/lib/api";
import AutocompleteSearch from "@/components/AutocompleteSearch";
import FilterPanel from "@/components/FilterPanel";
import SortOptions from "@/components/SortOptions";
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
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50">
      <header className="w-full max-w-5xl mb-8">
         <ClientComponentWrapper>
            <AutocompleteSearch doctors={doctors} />
         </ClientComponentWrapper>
      </header>
      
      {/* Main content area */}
      <div className="w-full max-w-5xl">
        {/* Sort Options above filters/list */}
        <ClientComponentWrapper>
            <SortOptions />
        </ClientComponentWrapper>

        {/* Filters and List */}
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4">
            <ClientComponentWrapper>
                <FilterPanel allSpecialties={allSpecialties} /> 
            </ClientComponentWrapper>
          </aside>

          <section className="w-full md:w-3/4">
            {/* Doctor List will go here */}
            <h2 className="text-xl font-semibold mb-4">Doctors</h2> {/* Remove count for now */}
            {/* We will map over filtered/sorted doctors here later */}
          </section>
        </div>
      </div>
    </main>
  );
}
