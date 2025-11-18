
import React, { useState, useEffect, useCallback } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';
import Header from './components/Header';
import { useTheme } from './hooks/useTheme';

// Mock Netlify Identity. In a real app, this would be imported.
declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const { theme, toggleTheme } = useTheme();

  // This effect simulates interaction with the Netlify Identity widget
  useEffect(() => {
    // In a real Netlify site, you would include the Netlify Identity Widget script tag in your index.html.
    // For this environment, we'll mock the behavior.
    
    // Attempt to get the current user from localStorage (where Netlify Identity stores it)
    const currentUser = JSON.parse(localStorage.getItem('gotrue.user') || 'null');
    if(currentUser) setUser(currentUser);

    // Mock listeners
    const handleLogin = (loggedInUser: any) => {
      setUser(loggedInUser);
      localStorage.setItem('gotrue.user', JSON.stringify(loggedInUser));
    };
    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('gotrue.user');
    };

    window.netlifyIdentity = {
      currentUser: () => JSON.parse(localStorage.getItem('gotrue.user') || 'null'),
      on: (event: string, callback: (user?: any) => void) => {
        if (event === 'login') {
          // @ts-ignore
          document.addEventListener('netlify-login', (e) => callback(e.detail));
        }
        if (event === 'logout') {
          document.addEventListener('netlify-logout', () => callback());
        }
      },
      open: () => {
         // This is a mock login event
        const mockUser = {
            email: 'test@example.com',
            token: { access_token: 'mock-token' },
            user_metadata: { full_name: 'Test User' },
        };
        document.dispatchEvent(new CustomEvent('netlify-login', { detail: mockUser }));
      },
      logout: () => {
        document.dispatchEvent(new CustomEvent('netlify-logout'));
      },
      init: () => {}
    };

    window.netlifyIdentity.on('login', handleLogin);
    window.netlifyIdentity.on('logout', handleLogout);

    // Cleanup mock listeners
    return () => {
      // In a real app, you might use netlifyIdentity.off(...)
    };
  }, []);

  const handleLogin = useCallback(() => {
    window.netlifyIdentity.open();
  }, []);

  const handleLogout = useCallback(() => {
    window.netlifyIdentity.logout();
  }, []);

  return (
    <div className={`min-h-screen font-sans text-text-primary-light dark:text-text-primary-dark transition-colors duration-300`}>
      {user ? (
        <div className="flex flex-col h-screen">
          <Header user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
          <main className="flex-1 overflow-hidden">
            <Chat />
          </main>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
