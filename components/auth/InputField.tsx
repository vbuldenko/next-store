import { ReactNode } from "react";

interface InputFieldProps {
  icon: ReactNode;
  type: string;
  name: string;
  id: string;
  placeholder: string;
  autoComplete?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputField({
  icon,
  value,
  onChange,
  ...props
}: InputFieldProps) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
      {icon}
      <input
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-gray-800"
        {...props}
      />
    </div>
  );
}
