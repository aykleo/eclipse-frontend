import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../hooks/user/use-context";
import { ExercisePage } from "./components/execises/exercise-page";
import { useNavBar } from "../../hooks/navbar-choices/navbar-context";
import { useEffect } from "react";
import { WorkoutsPage } from "./components/workouts/workouts-page";

export const UserPage = () => {
  return (
    <>
      <ExercisePage />
    </>
  );
};
