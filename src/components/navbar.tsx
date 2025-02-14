export const Navbar = () => {
  return (
    <div className="fixed z-99 flex items-center px-4 py-4 background-none justify-between h-14 w-full">
      <div className="flex items-center flex-row gap-x-6 justify-center">
        <h1>logo</h1>
        <button className="btn btn-ghost text-white hover:bg-red-500 focus:bg-red-500 focus:outline-none">
          About us
        </button>
        <button className="btn btn-ghost text-white hover:bg-red-500 focus:bg-red-500 focus:outline-none">
          Features
        </button>
        <button className="btn btn-ghost text-white hover:bg-red-500 focus:bg-red-500 focus:outline-none">
          Contact us
        </button>
        <button className="btn btn-ghost text-white hover:bg-red-500 focus:bg-red-500 focus:outline-none">
          Support
        </button>
      </div>
      <div className="flex items-center flex-row justify-center gap-x-6">
        <button className="btn btn-ghost text-white hover:bg-red-500 focus:bg-red-500 focus:outline-none">
          Language
        </button>
        <button className="btn btn-ghost text-white hover:bg-red-500 focus:bg-red-500 focus:outline-none">
          Home
        </button>
        <button className="btn btn-ghost text-white hover:bg-red-500 focus:bg-red-500 focus:outline-none">
          Login
        </button>
      </div>
    </div>
  );
};
