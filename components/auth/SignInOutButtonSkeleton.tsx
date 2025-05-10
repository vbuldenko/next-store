export default function SignInOutButtonSkeleton() {
  return (
    <button className="flex items-center gap-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 p-2">
      <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <span className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></span>
    </button>
  );
}
