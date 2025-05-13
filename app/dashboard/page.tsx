// import { UserDetails } from "../../components/UserDetails";

export default async function DashboardPage() {
  return (
    <main className="max-w-[75rem] w-full mx-auto">
      <div className="grid grid-cols-[1fr_20.5rem] gap-10 pb-10">
        {/* <UserDetails /> */}
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome to your dashboard. Here you can manage your account and
            settings.
          </p>
        </div>
      </div>
    </main>
  );
}
