import { useUser } from "../hooks/user-hooks/useUser";
import AnimatedGradientBorderBtn from "./gradient/animated-gradient-border-btn";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { AnimateTextGradient } from "./gradient/animate-text-gradient";
import { logOutUser } from "../utils/fetch-functions/log-out-user";

export const Navbar = () => {
  const { user, setUser } = useUser();

  const handleSignOut = async () => {
    try {
      await logOutUser();
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="fixed z-99 flex items-center px-10 py-4 background-none justify-between h-16 w-full backdrop-blur-sm">
      <AnimatedGradientBorderBtn
        className="from-red-300 to-red-800"
        borderSize="p-[5px] cursor-default"
      >
        <div className="rounded-full size-4"></div>
      </AnimatedGradientBorderBtn>
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
              <span>aaa</span>
              <span>vvv</span>
              <span>aaa</span>
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

{
  /* <div className="fixed z-99 flex items-center px-6 py-4 background-none justify-between h-26 w-full">
      <div className="relative h-full flex">
        <div className="font-rounded font-medium text-4xl flex items-center justify-center size-20 rounded-full bg-black shadow-[1px_0px_10px_7px_rgba(255,255,255,1),-6px_-5px_5px_7px_rgba(255,255,255,0.1),0px_0px_50px_10px_rgba(255,0,0,0.8),0px_0px_15px_15px_rgba(255,0,0,1),inset_0px_0px_35px_2px_rgba(255,0,0,0.5),0px_0px_100px_75px_rgba(255,0,0,0.2)]"></div>

        <div
          className="absolute top-42 right-66"
          style={{
            transform: "rotate(-90deg)",
          }}
        >
          <div
            className="shadow-[-12px_0px_20px_1px_rgba(255,0,0,1)] absolute top-64 left-27 bg-white w-6.25 h-10 blur-xs"
            style={{
              borderRadius: "100% / 100%",
              transform: "rotate(-45deg)",
            }}
          />

          <>
            <div className="absolute z-3 top-66 left-27 w-10 h-lvw blur-xs bg-white" />
            <div className="absolute z-3 top-71 left-28 w-8 h-lvw bg-white flex items-center justify-between text-black"></div>
            <div className="shadow-[5px_0px_25px_7px_rgba(255,0,0,0.4),0px_40px_20px_10px_rgba(255,0,0,0.5)] absolute top-68 left-33 w-3 h-lvw blur-xs bg-white" />
            <div
              className="shadow-[5px_0px_25px_7px_rgba(255,0,0,0.4),0px_-40px_20px_10px_rgba(255,0,0,0.5)] absolute top-68 left-27 blur-xs w-3 h-lvw bg-white"
              style={{
                transform: "rotate(180deg)",
              }}
            />
          </>

          <div
            className="shadow-[-20px_0px_20px_0.5px_rgba(255,0,0,0.4)] bg-white absolute top-63 left-25 w-2 h-4 blur-xs"
            style={{
              borderRadius: "100% / 100%",
              transform: "rotate(-45deg)",
            }}
          />
          <div
            className="shadow-[10px_0px_20px_1px_rgba(255,0,0,0.4)] absolute top-66 left-32.5 w-4.5 h-8 blur-xs bg-white"
            style={{
              borderRadius: "100% / 100%",
              transform: "rotate(30deg)",
            }}
          />
          <div
            className="shadow-[20px_0px_20px_1px_rgba(255,0,0,0.4)] absolute top-64 bg-white left-36 w-2 h-4 blur-xs"
            style={{
              borderRadius: "100% / 100%",
              transform: "rotate(45deg)",
            }}
          />
        </div>
      </div>
    </div> */
}
