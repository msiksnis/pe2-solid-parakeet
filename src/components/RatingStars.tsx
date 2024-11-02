import { Star, StarHalf, Star as EmptyStar } from "lucide-react";

interface RatingStarsProps {
  /** The rating value to render. */
  rating: number;
}

/**
 * Renders star icons based on a given rating value.
 *
 * @param props - The props object containing the rating.
 * @returns A JSX element displaying the star rating.
 */

export default function RatingStars({ rating }: RatingStarsProps) {
  // To round the rating to the nearest half for rendering purposes
  const roundedRating = Math.round(rating * 2) / 2;

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(
          <Star
            key={i}
            className="inline size-5 fill-yellow-500 text-yellow-500"
          />,
        );
      } else if (i - 0.5 === roundedRating) {
        stars.push(
          <StarHalf
            key={i}
            className="inline size-5 fill-yellow-500 text-yellow-500"
            strokeWidth={1.5}
          />,
        );
      } else {
        stars.push(
          <EmptyStar key={i} className="inline size-5 text-yellow-500" />,
        );
      }
    }

    return stars;
  };

  return <div className="flex">{renderStars()}</div>;
}
