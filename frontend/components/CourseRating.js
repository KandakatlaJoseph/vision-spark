import { useState, useEffect } from 'react';

export default function CourseRating({ courseId, initialRating = 4.9 }) {
  const [rating, setRating] = useState(initialRating);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [rated, setRated] = useState(false);

  useEffect(() => {
    try {
      const savedRatings = JSON.parse(localStorage.getItem('vision_spark_course_ratings') || '{}');
      if (savedRatings[courseId]) {
        setUserRating(savedRatings[courseId]);
        setRated(true);
      }
    } catch (err) {}
  }, [courseId]);

  const handleRate = (stars) => {
    setUserRating(stars);
    setRated(true);
    
    // Save to localStorage
    try {
      const savedRatings = JSON.parse(localStorage.getItem('vision_spark_course_ratings') || '{}');
      savedRatings[courseId] = stars;
      localStorage.setItem('vision_spark_course_ratings', JSON.stringify(savedRatings));
    } catch (err) {}
  };

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transition-transform hover:scale-125"
            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <span
              className={`${
                (hoverRating || userRating || Math.round(rating)) >= star
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-300'
              }`}
            >
              ★
            </span>
          </button>
        ))}
      </div>
      <span className="text-amber-600 font-extrabold text-xs">
        {userRating > 0 ? `${userRating}.0` : rating}
      </span>
      {rated && (
        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
          Rated!
        </span>
      )}
    </div>
  );
}
