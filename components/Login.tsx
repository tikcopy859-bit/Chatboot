
import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-content-light dark:bg-content-dark">
      <div className="w-full max-w-sm p-8 space-y-8 bg-bkg-light dark:bg-bkg-dark rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-text-primary-light dark:text-text-primary-dark">
            Welcome to Gemini Chat
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Sign in to continue
          </p>
        </div>
        <div className="space-y-6">
           {/* In a real app, you might have email/password fields here that integrate with Netlify Identity */}
           {/* For this implementation, we use a single button to trigger the mock login widget */}
          <div>
            <button
              onClick={onLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-light hover:bg-opacity-90 dark:bg-primary-dark dark:hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            >
              Login with Netlify Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
