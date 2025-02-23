import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../../api/user/fetch-user";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../hooks/user/use-context";
import { ExercisePage } from "./components/execises/exercise-page";
import { useNavBar } from "../../hooks/navbar-choices/navbar-context";

export const UserPage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { navbarChoices } = useNavBar();

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
  });

  useEffect(() => {
    if (error) {
      navigate("/");
    } else if (userData) {
      if (userData.username !== username) {
        navigate("/");
      } else {
        setUser(userData);
      }
    }
  }, [userData, error, username, navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {navbarChoices === "exercises" && <ExercisePage />}
      {/* {navbarChoices === "workouts" && <WorkoutPage />}
      {navbarChoices === "statistics" && <StatisticsPage />} */}
    </>
  );
};
