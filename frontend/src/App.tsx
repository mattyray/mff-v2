import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import CampaignPage from './components/CampaignPage';
import UserMenu from './components/UserMenu';
import { useAuth } from './hooks/useAuth';

function App() {
  const { checkAuthStatus } = useAuth();
  
  // Simple routing based on URL path
  const path = window.location.pathname;

  // Success page
  if (path === '/success') {
    return (
      <div className="min-h-screen bg-[var(--ocean-mist)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--ocean-deep)] mb-4">
            Thank You! 🎉
          </h1>
          
          <p className="text-[var(--ocean-driftwood)] mb-6">
            Your donation has been successfully processed. You're helping make a real difference in Matt's journey!
          </p>
          
          <button
            onClick={() => window.location.href = '/'}
            className="btn-ocean-primary w-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Campaign
          </button>
        </div>
      </div>
    );
  }

  // Cancel page
  if (path === '/cancel') {
    return (
      <div className="min-h-screen bg-[var(--ocean-mist)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-orange-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--ocean-deep)] mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-[var(--ocean-driftwood)] mb-6">
            No worries! Your payment was cancelled and no charges were made.
          </p>
          
          <button
            onClick={() => window.location.href = '/'}
            className="btn-ocean-primary w-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Default campaign page
  return (
    <div className="min-h-screen">
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

      <main>
        <CampaignPage />
      </main>
    </div>
  );
}

export default App;