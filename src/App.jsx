import { TaskProvider } from "./context/TaskContext";
import { SearchBar } from "./components/SearchBar";
import { FilterBar } from "./components/FilterBar";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { Stats } from "./components/Stats";

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#2563EB] py-6 sm:py-12 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="relative text-center mb-8 sm:mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-cyan-800/20 blur-3xl"></div>
            <h1 className="relative text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 animate-gradient-x">
              TODOS
            </h1>

            <div className="mt-3 sm:mt-4 flex justify-center gap-2">
              <span className="px-2 sm:px-3 py-1 bg-cyan-900/30 text-white text-xs sm:text-sm rounded-full border border-cyan-700/50">
                unkmitm
              </span>
            </div>
          </div>
          {/* Main Content */}
          <SearchBar />
          <FilterBar />
          <TaskForm />
          <TaskList />
          <Stats />
        </div>
      </div>
    </TaskProvider>
  );
}

export default App;
