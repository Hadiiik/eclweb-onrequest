import { FaStar } from "react-icons/fa";

interface RatingDisplayProps {
  rating: number;
  max?: number;  
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ rating, max = 5 }) => {
    return (
    <div className="flex flex-row-reverse items-center space-x-2 space-x-reverse text-gray-700" dir="rtl">
      <FaStar size={24} className="text-yellow-400" />
      <span className="text-lg font-medium">{rating}/{max}</span>
    </div>
  );
};

export default RatingDisplay;
