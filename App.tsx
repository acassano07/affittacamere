import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

import SettingsPage from './pages/SettingsPage';
import TodayTomorrowPage from './pages/TodayTomorrowPage';
import RoomOverviewPage from './pages/RoomOverviewPage';
import Header from './components/Header';
import { DataProvider } from './hooks/useData';
import { BedDouble, User, Calendar } from 'lucide-react'; // Diagnostic import

function App() {
  return (
    <DataProvider>
      <HashRouter>
        <div className="flex flex-col h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header />
          <main className="flex-grow overflow-y-auto mb-16 md:mb-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              <Route path="/today-tomorrow" element={<TodayTomorrowPage />} />
              <Route path="/room-overview" element={<RoomOverviewPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </DataProvider>
  );
}

export default App;