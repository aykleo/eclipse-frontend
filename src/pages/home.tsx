import { ArrowRightIcon, WandSparklesIcon } from "lucide-react";
import { RegisterModal } from "../components/modals/auth-modals/register-modal";
import { LogInModal } from "../components/modals/auth-modals/logIn-modal";
import { useNavigate } from "react-router-dom";
import { AnimateTextGradient } from "../components/gradient/animate-text-gradient";
import { fetchUser } from "../utils/fetch-functions/fetch-user";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../hooks/user-hooks/useUser";
import { useEffect } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const { data: userData, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
  });

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (userData) {
      if (user && user.username === userData.name) {
        navigate(`/${userData.username}`);
      } else {
        navigate(`/${userData.username}`);
      }
    }
  }, [user, userData, error, navigate]);

  return (
    <>
      <div className="w-full z-1 h-full flex items-center justify-center px-4 flex-col">
        <div className="bg-gradient-to-tl from-red-500/10 gap-y-6 via-transparent px-10 md:px-20 lg:px-40 pt-40 pb-14 to-transparent w-full h-full rounded-b-4xl flex-col flex items-center justify-center">
          <h1 className="text-8xl font-bold font-marker tracking-widest text-gradient animate-gradient">
            ECLIPSE
          </h1>
          <p className="text-md text-center text-md text-gray-300">
            Customize your workouts, track progress, and analyze performance
            with ease. Our training app helps you stay motivated, monitor
            recovery, and achieve your fitness goals efficiently.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <button
              onClick={() => {
                const modal = document.getElementById(
                  "register_modal"
                ) as HTMLDialogElement;
                modal?.showModal();
              }}
              className="hover:bg-gray-200 group cursor-pointer rounded-full bg-gray-100 flex items-center justify-center flex-row gap-x-2 px-5 py-1"
            >
              <span className="group-hover:text-black font-semibold text-stone-800 text-xl">
                Get Started
              </span>
              <ArrowRightIcon className="size-5 text-red-800 group-hover:text-red-900" />
            </button>
            <button className="group hover:bg-stone-950/85 cursor-pointer rounded-full bg-stone-950 border-black text-white text-xl flex items-center border-none justify-center flex-row gap-x-2 px-5 py-1">
              <WandSparklesIcon className="size-5 text-gray-400 group-hover:text-gray-300" />
              <span className="text-gray-400 group-hover:text-gray-300 font-semibold">
                Read our docs
              </span>
            </button>
          </div>
        </div>
        <div className="bg-black w-full h-96"></div>
        <div className="bg-gradient-to-r from-transparent via-red-950/25 to-transparent w-full h-full rounded-t-4xl"></div>
      </div>
      <RegisterModal />
      <LogInModal />
      <AnimateTextGradient />
    </>
  );
}
