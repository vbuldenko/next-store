import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

const Rating = ({ value, caption }: { value: number; caption?: string }) => {
  // Ensure value is between 0 and 5
  const safeValue = Math.min(5, Math.max(0, value));

  return (
    <div className="flex gap-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;

          if (safeValue >= starValue) {
            return (
              <BsStarFill key={index} className="text-yellow-500 w-5 h-auto" />
            );
          } else if (safeValue >= starValue - 0.5) {
            return (
              <BsStarHalf key={index} className="text-yellow-500 w-5 h-auto" />
            );
          } else {
            return (
              <BsStar key={index} className="text-yellow-500 w-5 h-auto" />
            );
          }
        })}
      </div>

      {caption && <span className="text-sm">{caption}</span>}
    </div>
  );
};

export default Rating;
