import { HiOutlineShoppingBag } from "react-icons/hi";

interface CartIndicatorProps {
  count: number;
}

const CartIndicator = ({ count }: CartIndicatorProps) => {
  return (
    <button className="relative cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 p-2">
      <HiOutlineShoppingBag className="size-6" />
      {count > 0 && (
        <span className="absolute top-1 right-1 bg-black dark:bg-white text-white dark:text-black text-[10px] sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
};

export default CartIndicator;
