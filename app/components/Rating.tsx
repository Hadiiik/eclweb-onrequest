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
  const [loading, setLoading] = useState(false); // ✅ حالة التحميل

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
      .catch(console.error);
  }, [id]);

const handleSave = () => {
  setLoading(true);

  setTimeout(() => {
    setRating(tempRating); // اعتمد القيمة المؤقتة
    if (ip) saveRating(id, ip, tempRating).catch(console.error);

    setLoading(false);
    setOpen(false);
  }, 2000);
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
                disabled={loading}
                className={`px-6 py-2 rounded-lg shadow flex items-center justify-center gap-2 transition 
                  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}
                `}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  "تم"
                )}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Rating;
