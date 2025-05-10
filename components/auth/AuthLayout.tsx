interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
