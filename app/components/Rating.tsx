import { useState, useEffect, MouseEvent } from "react";
import { FaStar } from "react-icons/fa";
import { saveRating, getRating } from "../../client/helpers/db";

interface RatingProps {
  id: string; // id الملف
  initialRating?: number;
  maxRating?: number;
  size?: number;
}

const Rating: React.FC<RatingProps> = ({
  id,
  initialRating = 0,
  maxRating = 5,
  size = 24,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [ip, setIp] = useState<string | null>(null);

  // جلب IP المستخدم عند التحميل
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => {
        setIp(data.ip);
        return getRating(id, data.ip);
      })
      .then((stored) => {
        if (stored) setRating(stored.rating);
      })
      .catch(console.error);
  }, [id]);

  const handleClick = (event: MouseEvent<HTMLSpanElement>, index: number) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;
    const isRightHalf = clickX > width / 2;

    const starPosition = maxRating - index;
    const newRating = isRightHalf ? starPosition : starPosition - 0.5;

    setRating(newRating);

    if (ip) saveRating(id, ip, newRating).catch(console.error);
  };

  const renderStar = (index: number) => {
    const starPosition = maxRating - index;

    if (rating >= starPosition) {
      return <FaStar size={size} color="#FFD700" />;
    } else if (rating >= starPosition - 0.5) {
      return (
        <div style={{ position: "relative", width: size, height: size }}>
          <FaStar
            size={size}
            color="#FFD700"
            style={{ position: "absolute", clipPath: "inset(0 50% 0 0)" }}
          />
          <FaStar
            size={size}
            color="#e4e5e9"
            style={{ position: "absolute", clipPath: "inset(0 0 0 50%)" }}
          />
        </div>
      );
    } else {
      return <FaStar size={size} color="#e4e5e9" />;
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <span
          key={i}
          style={{ cursor: "pointer", display: "inline-block" }}
          onClick={(e) => handleClick(e, i)}
        >
          {renderStar(i)}
        </span>
      ))}
      <span style={{ marginLeft: "8px", fontSize: "1rem" }}>
        {rating} / {maxRating}
      </span>
    </div>
  );
};

export default Rating;
