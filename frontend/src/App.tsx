import { History } from 'lucide-react';
import ErrorDisplay from './components/ErrorDisplay';
import UserMenu from './components/UserMenu';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, checkAuthStatus } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Matt Freedom Fundraiser</h1>
                <p className="text-sm text-gray-500">Supporting Matt's Journey</p>
              </div>
            </div>
            
            <UserMenu 
              onShowRegistrationGate={() => {
                // TODO: Implement donor registration
                console.log('Show donor registration');
              }}
              onUserStateChange={() => {
                checkAuthStatus();
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Matt's Fundraiser
          </h2>
          <p className="text-lg text-gray-600">
            Coming soon - Matt's inspiring story and donation platform
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Supporting Matt Raynor's incredible journey
            </p>
            <p className="text-gray-500 text-xs mt-2">
              From diving accident to inspiring developer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;