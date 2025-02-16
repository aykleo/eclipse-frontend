import { TagCategory } from "./types/exercise-types";

export const getColorClassForTagCategory = (category: TagCategory): string => {
  switch (category) {
    case TagCategory.ENDURANCE:
      return "text-blue-500";
    case TagCategory.MOVEMENT:
      return "text-green-500";
    case TagCategory.PLYOMETRICS:
      return "text-yellow-500";
    case TagCategory.STRENGTH:
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export const getColorBackgroundForTagCategory = (
  category: TagCategory
): string => {
  switch (category) {
    case TagCategory.ENDURANCE:
      return "bg-blue-500";
    case TagCategory.MOVEMENT:
      return "bg-green-500";
    case TagCategory.PLYOMETRICS:
      return "bg-yellow-500";
    case TagCategory.STRENGTH:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
