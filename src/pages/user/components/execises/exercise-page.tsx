import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ExerciseCodex } from "./exercise-codex/exercise-codex";
import { useUser } from "../../../../hooks/user/use-context";
import { useEffect } from "react";

export const ExercisePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useUser() || {};

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.username !== username) {
      navigate("/");
    }
  }, [user, username, navigate]);

  return (
    <div className="size-full self-start pt-16">
      <div className="relative ">
        <ExerciseCodex />
        {/* <ExerciseStatistics /> */}
      </div>
    </div>
  );
};
