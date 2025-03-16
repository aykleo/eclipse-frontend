import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../hooks/user/use-context";
import { ExercisePage } from "./components/execises/exercise-page";
import { useNavBar } from "../../hooks/navbar-choices/navbar-context";
import { useEffect } from "react";

export const UserPage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useUser() || {};
  const { navbarChoices } = useNavBar();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.username !== username) {
      navigate("/");
    }
  }, [user, username, navigate]);

  return (
    <>
      {navbarChoices === "exercises" && <ExercisePage />}
      {/* {navbarChoices === "workouts" && <WorkoutPage />}
      {navbarChoices === "statistics" && <StatisticsPage />} */}
    </>
  );
};
