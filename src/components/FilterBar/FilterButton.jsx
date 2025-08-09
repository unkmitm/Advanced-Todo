export const FilterButton = ({ active, onClick, children }) => {
  return (
    // button filters
    <button
      onClick={onClick}
      className={`px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg ${
        active ? 'bg-blue-500 text-white' : 'bg-gray-700'
      } transition-colors duration-200 whitespace-nowrap`}
    >
      {children}
    </button>
  );
};
