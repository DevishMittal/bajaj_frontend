import { fetchDoctors } from "@/lib/api";

export default async function Home() {
  const doctors = await fetchDoctors();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50">
      <header className="w-full max-w-5xl mb-8">
        {/* Autocomplete Header will go here */}
        <h1 className="text-2xl font-semibold text-center text-blue-600">Doctor Search</h1>
      </header>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          {/* Filter Panel will go here */}
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
        </aside>

        <section className="w-full md:w-3/4">
          {/* Doctor List will go here */}
          <h2 className="text-xl font-semibold mb-4">Doctors ({doctors.length})</h2>
          {doctors.length === 0 && <p>No doctors found.</p>}
          {/* We will map over doctors here later */}
        </section>
      </div>
    </main>
  );
}
