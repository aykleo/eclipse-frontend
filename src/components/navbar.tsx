import { useUser } from "../hooks/user/use-context";
import AnimatedGradientBorderBtn from "./gradient/animated-gradient-border-btn";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { AnimateTextGradient } from "./modals/animate-text-gradient";
import { logOutUser } from "../api/user/log-out-user";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../routes";

export const Navbar = () => {
  const { user, clearUser } = useUser() || {};
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (!clearUser) {
      return;
    }
    try {
      clearUser();

      await logOutUser();

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="fixed z-999 bg-black flex items-center px-10 py-4 background-none justify-between h-16 w-full">
      <div className="flex flex-row gap-x-4 md:gap-x-10 lg:gap-x-16">
        <AnimatedGradientBorderBtn
          className="from-red-300 to-red-800"
          borderSize="p-[5px] cursor-default"
        >
          <div className="rounded-full size-4"></div>
        </AnimatedGradientBorderBtn>
        {user ? (
          <div className="hidden md:flex flex-row gap-x-1 md:gap-x-6 lg:gap-x-10 text-red-400">
            {routes.map((route) => (
              <Link
                key={route.label}
                to={route.href}
                className={
                  route.label === "exercises" ? "text-red-600 font-bold" : ""
                }
              >
                {route.label}
              </Link>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
      {!user ? (
        <AnimatedGradientBorderBtn
          onClick={() => {
            const modal = document.getElementById(
              "login_modal"
            ) as HTMLDialogElement;
            modal?.showModal();
          }}
          text="Sign In"
          textClassName="px-3 py-1"
        >
          <ArrowRightIcon className="size-4" />
        </AnimatedGradientBorderBtn>
      ) : (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="gradient-border-btn text-gradient animate-gradient text-xl cursor-pointer flex items-center flex-row gap-x-1"
          >
            {user.username}
            {/* <ArrowDownIcon className="size-4 text-gray-700" /> */}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-300 opacity-100 rounded-box z-1 w-36 p-2 shadow-sm"
          >
            <li>
              {routes.map((route) => (
                <Link key={route.label} to={route.href} className="md:hidden">
                  {route.label}
                </Link>
              ))}
            </li>
            <li>
              <button onClick={handleSignOut} className="pl-3 py-1 gap-y-1.5">
                Sign Out
                <ArrowLeftIcon className="size-4" />
              </button>
            </li>
          </ul>
        </div>
      )}
      <AnimateTextGradient />
    </div>
  );
};
