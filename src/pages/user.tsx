import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/user-hooks/useUser";
import { ListAllExercises } from "../components/execises/list-all-exercises";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../utils/fetch-functions/fetch-user";
import { useEffect } from "react";

export const UserPage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { setUser } = useUser();

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
    <div className="grid grid-cols-5 size-full z-1 p-4 gap-x-3">
      <div className="mt-16 col-start-1 col-span-2 size-screen flex flex-col relative p-[2px] rounded-lg overflow-hidden">
        <div
          style={{
            background:
              "conic-gradient(rgba(253, 51, 51, 0.8) 0deg, rgba(255, 102, 102, 0.8) 100deg, transparent 150deg)",
          }}
          className="absolute -z-1 top-1/2 left-1/2 w-full h-full animate-spin-slow"
        />
        <div className="h-full w-full flex flex-col rounded-lg bg-stone-950">
          <ListAllExercises />
        </div>
      </div>
      <div className="mt-16 col-start-3 gap-y-6 col-span-3 size-screen flex flex-col items-center justify-center p-3">
        <div className="w-full h-32 flex justify-evenly gap-x-8">
          <span className="h-32 w-full border">tag 1</span>
          <span className="h-32 w-full border">tag 2</span>
          <span className="h-32 w-full border">tag 3</span>
          <span className="h-32 w-full border">tag 4</span>
        </div>
        <div className="w-full h-full border">charts</div>
      </div>
      <style>
        {`
      @keyframes spinSlow {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spinSlow 5s linear infinite;
      }
      
   `}
      </style>
    </div>
  );
};
