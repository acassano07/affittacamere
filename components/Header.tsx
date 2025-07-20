import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Settings, BedDouble } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const linkClass = "flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors";
  const activeLinkClass = "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 font-semibold";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg w-full z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <span role="img" aria-label="bed" className="mr-2">🛏️</span>
              Gestionale
            </NavLink>
          </div>
          <nav className="hidden md:flex md:space-x-4">
            <NavLink to="/" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
              <Calendar className="h-5 w-5 mr-2" />
              Calendario
            </NavLink>
            
            <NavLink to="/today-tomorrow" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
              <Calendar className="h-5 w-5 mr-2" />
              Oggi/Domani
            </NavLink>
            <NavLink to="/room-overview" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
              <BedDouble className="h-5 w-5 mr-2" />
              Camere
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>
              <Settings className="h-5 w-5 mr-2" />
              Impostazioni
            </NavLink>
          </nav>
          <div className="ml-4 hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
       {/* Bottom nav for mobile */}
       <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-t border-t border-gray-200 dark:border-gray-700 flex justify-around py-2">
            <div className="flex items-center justify-center w-full py-1">
              <ThemeToggle />
            </div>
            <NavLink to="/" className={({ isActive }) => `flex flex-col items-center text-xs w-full py-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <Calendar className="h-5 w-5" />
              <span>Calendario</span>
            </NavLink>
            
            <NavLink to="/today-tomorrow" className={({ isActive }) => `flex flex-col items-center text-xs w-full py-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
              <Calendar className="h-5 w-5" />
              <span>Oggi/Domani</span>
            </NavLink>
            <NavLink to="/room-overview" className={({ isActive }) => `flex flex-col items-center text-xs w-full py-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
              <BedDouble className="h-5 w-5" />
              <span>Camere</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center text-xs w-full py-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
              <Settings className="h-5 w-5" />
              <span>Impostazioni</span>
            </NavLink>
        </nav>
    </header>
  );
};

export default Header;