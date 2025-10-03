import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { saveRating, getRating } from "../../client/helpers/db";

interface RatingProps {
  id: string;
  initialRating?: number;
  maxRating?: number;
}

const Rating: React.FC<RatingProps> = ({
  id,
  initialRating = 0,
  maxRating = 5,
}) => {
  const [rating, setRating] = useState(initialRating); // القيمة النهائية
  const [tempRating, setTempRating] = useState(initialRating); // القيمة المؤقتة
  const [open, setOpen] = useState(false);
  const [ip, setIp] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setIp(data.ip);
        return getRating(id, data.ip);
      })
      .then((stored) => {
        if (stored) {
          setRating(stored.rating);
          setTempRating(stored.rating);
        }
      })
      .catch();
  }, [id]);

  const handleSave = async () => {
    
    setRating(tempRating); // اعتمد القيمة المؤقتة
    if (ip) saveRating(id, ip, tempRating).catch();
       await fetch("/api/rate_file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId: id, rating: tempRating }),
      });
      
    setOpen(false);
  };

  const renderStar = (index: number) => {
    const starPosition = maxRating - index;

    if (tempRating >= starPosition) {
      return <FaStar size={30} color="#FFD700" />;
    } else if (tempRating >= starPosition - 0.5) {
      return (
        <div className="relative w-[30px] h-[30px]">
          <FaStar
            size={30}
            color="#FFD700"
            className="absolute left-0 top-0"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
          <FaStar
            size={30}
            color="#e4e5e9"
            className="absolute left-0 top-0"
            style={{ clipPath: "inset(0 0 0 50%)" }}
          />
        </div>
      );
    } else {
      return <FaStar size={30} color="#e4e5e9" />;
    }
  };

  return (
    <>
      {/* زر فتح اللوحة */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition mb-2"
      >
        قيّم {rating ? `(${rating})` : ""}
      </button>


      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-[999]">
          <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6">
            {/* العنوان */}
            <h2 className="text-xl font-semibold text-center mb-4">التقييم</h2>

            {/* النجوم */}
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: maxRating }).map((_, i) => (
                <span key={i}>{renderStar(i)}</span>
              ))}
            </div>

            {/* الشريط */}
            <div className="mb-6" dir="ltr">
              <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={tempRating}
              onChange={(e) => setTempRating(parseFloat(e.target.value))}
              className="w-full accent-yellow-400"
              style={{ cursor: "pointer" }}
            />

              <div className="flex justify-between text-xs text-gray-500 mt-1">
                {Array.from({ length: maxRating * 2 }).map((_, i) => (
                  <span key={i}>{(i + 1) / 2}</span>
                ))}
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                تم
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Rating;