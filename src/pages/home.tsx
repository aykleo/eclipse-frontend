import { EclipseCircle } from "../components/eclipse-circle";

export default function HomePage() {
  return (
    <div className="grid grid-cols-3 gap-y-10 z-1 relative overflow-hidden h-full antialiased">
      <div className="col-start-1 col-span-2 h-full items-center justify-center flex mt-14 flex-col gap-y-4 py-10 px-4">
        <div className="w-full h-full flex items-center justify-center border-t border-b border-gray-500">
          DESCRIÇÕES
        </div>
        <div className="w-full h-full flex items-center justify-center mb-10 border-t border-b border-gray-500">
          features in corrousel
        </div>
      </div>
      <div className="col-start-3 col-span-1 w-full relative flex flex-col items-center justify-start h-full mt-14 py-14">
        <EclipseCircle />
        <div className="w-full flex-col items-center gap-y-6 flex top-100 z-3 absolute justify-center ml-1.5">
          <button className="cursor-pointer text-center text-white hover:text-red-500 transition-colors duration-200 w-64 border-0 bg-gradient-to-r from-stone-900/75 via-black to-stone-900/75 rounded-md h-12 text-2xl hover:scale-110 focus:outline-red-500 focus:outline-1 focus:text-red-500">
            GET STARTED
          </button>
          <button className="cursor-pointer text-center text-white hover:text-red-500 transition-colors duration-200 w-64 border-0 bg-gradient-to-r from-stone-900/75 via-black to-stone-900/75 rounded-md h-12 text-2xl hover:scale-110 focus:outline-red-500 focus:outline-1 focus:text-red-500">
            WHATS COMING?
          </button>
          <button className="cursor-pointer text-center text-white hover:text-red-500 transition-colors duration-200 w-64 border-0 bg-gradient-to-r from-stone-900/75 via-black to-stone-900/75 rounded-md h-12 text-2xl hover:scale-110 focus:outline-red-500 focus:outline-1 focus:text-red-500">
            DONATE
          </button>
        </div>
      </div>
    </div>
  );
}
