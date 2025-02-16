import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../hooks/user-hooks/useUser";
import { ListAllExercises } from "../components/execises/list-all-exercises";

export const UserPage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  useEffect(() => {
    const verifyUser = async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      if (user && user.username) {
        navigate(`/${user.username}`);
      } else {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_ECLIPSE_DEV_API_URL}/user/me`,
            {
              method: "GET",
              credentials: "include",
              signal,
            }
          );

          if (response.ok) {
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
              const userFromServer = await response.json();
              console.log(userFromServer);
              if (userFromServer && userFromServer.username !== username) {
                navigate("/");
              } else {
                setUser(userFromServer);
              }
            }
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Failed to verify user:", error);
          navigate("/");
        } finally {
          controller.abort();
        }
      }
    };

    verifyUser();
  }, [username, navigate]); // eslint-disable-line react-hooks/exhaustive-deps
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
