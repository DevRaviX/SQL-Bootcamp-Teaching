import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');

// Dynamic imports — audience/presenter windows never download export code
const App           = lazy(() => import('./App.jsx'));
const AudienceView  = lazy(() => import('./components/AudienceView.jsx'));
const PresenterView = lazy(() => import('./components/PresenterView.jsx'));

const Root = () => {
  if (mode === 'audience')  return <AudienceView />;
  if (mode === 'presenter') return <PresenterView />;
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#080a12', color: '#6366f1', fontSize: '1.2rem', fontFamily: 'system-ui' }}>
        Loading...
      </div>
    }>
      <Root />
    </Suspense>
  </React.StrictMode>
);
