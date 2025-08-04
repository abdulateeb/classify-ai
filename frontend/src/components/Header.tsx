import { Sun, Moon, Recycle } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <Recycle className="w-8 h-8 text-green-600 dark:text-green-400" />
        <h1 className="text-xl font-bold dark:text-white">Material Classification</h1>
      </div>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Toggle theme"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </header>
  );
}