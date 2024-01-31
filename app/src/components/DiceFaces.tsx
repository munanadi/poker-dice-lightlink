export const KingDice = () => {
  return (
    <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg  hover:cursor-pointer  hover:text-white  hover:bg-gray-700 hover:animate-pulse">
      <div className="text-gray-900flex items-center">
        <KingIcon className="h-10 w-10 text-gray-900 dark:text-gray-10" />
      </div>
    </div>
  );
};

export const QueenDice = () => {
  return (
    <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg  hover:cursor-pointer  hover:text-white  hover:bg-gray-700 hover:animate-pulse">
      <div className="text-gray-900flex items-center">Q</div>
    </div>
  );
};
export const JokerDice = () => {
  return (
    <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg  hover:cursor-pointer  hover:text-white  hover:bg-gray-700 hover:animate-pulse">
      <div className="text-gray-900flex items-center">J</div>
    </div>
  );
};
export const TenDice = () => {
  return (
    <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg  hover:cursor-pointer  hover:text-white  hover:bg-gray-700 hover:animate-pulse">
      <div className="text-gray-900flex items-center">10</div>
    </div>
  );
};
export const NineDice = () => {
  return (
    <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg  hover:cursor-pointer  hover:text-white  hover:bg-gray-700 hover:animate-pulse">
      <div className="text-gray-900flex items-center">9</div>
    </div>
  );
};
export const AceDice = () => {
  return (
    <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg  hover:cursor-pointer  hover:text-white  hover:bg-gray-700 hover:animate-pulse">
      <div className="text-gray-900flex items-center">A</div>
    </div>
  );
};

export const EmptyDice = () => {
  return (
    <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-lg  hover:cursor-pointer  hover:text-white  hover:bg-gray-700 hover:animate-pulse">
      <div className="text-gray-900flex items-center">?</div>
    </div>
  );
};

function KingIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-crown"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
