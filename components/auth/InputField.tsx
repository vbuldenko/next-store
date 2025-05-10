import { ReactNode } from "react";

interface InputFieldProps {
  icon: ReactNode;
  type: string;
  name: string;
  id: string;
  placeholder: string;
}

export default function InputField({
  icon,
  type,
  name,
  id,
  placeholder,
}: InputFieldProps) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
      {icon}
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-gray-800"
      />
    </div>
  );
}
