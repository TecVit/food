import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

type StarRatingProps = {
  rating: number;
};

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="stars">
      {[...Array(fullStars)].map((_, index) => (
        <IoIosStar className="star" key={`full-${index}`} />
      ))}
      
      {hasHalfStar && <IoIosStarHalf className="star" key="half" />}
      
      {[...Array(emptyStars)].map((_, index) => (
        <IoIosStarOutline className="star" key={`empty-${index}`} />
      ))}
    </div>
  );
};

export default StarRating;