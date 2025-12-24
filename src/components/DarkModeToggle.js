import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-pastel-cream dark:bg-dark-surface hover:bg-pastel-butter dark:hover:bg-dark-surfaceLight transition-colors duration-200 border border-pastel-lavender dark:border-dark-border"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-pastel-apricot dark:text-pastel-peach" />
      ) : (
        <Moon className="w-5 h-5 text-pastel-mauve dark:text-pastel-lavender" />
      )}
    </button>
  );
};

export default DarkModeToggle;

