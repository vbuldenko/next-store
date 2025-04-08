import { UserDetails } from "@/components/UserDetails";

export default async function DashboardPage() {
  return (
    <main className="max-w-[75rem] w-full mx-auto">
      <div className="grid grid-cols-[1fr_20.5rem] gap-10 pb-10">
        <UserDetails />
      </div>
    </main>
  );
}
