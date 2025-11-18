
import React from 'react';
import { SunIcon, MoonIcon, LogoutIcon } from './icons/Icons';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, toggleTheme }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-bkg-light dark:bg-bkg-dark border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <h1 className="text-xl font-bold text-primary-light dark:text-primary-dark">
        Gemini AI Chatbot
      </h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark hidden sm:block">
          Welcome, {user?.user_metadata?.full_name || user?.email}
        </span>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <button
          onClick={onLogout}
          className="p-2 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Logout"
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
