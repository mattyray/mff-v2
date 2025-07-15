import React from 'react';
import CampaignPage from './components/CampaignPage';
import UserMenu from './components/UserMenu';
import { useAuth } from './hooks/useAuth';

function App() {
  const { checkAuthStatus } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Simple header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Matt Freedom Fundraiser</h1>
            </div>
            
            <UserMenu 
              onShowRegistrationGate={() => console.log('Show registration')}
              onUserStateChange={checkAuthStatus}
            />
          </div>
        </div>
      </header>

      {/* Main campaign page */}
      <main>
        <CampaignPage />
      </main>
    </div>
  );
}

export default App;