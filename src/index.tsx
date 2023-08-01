import React from 'react';
import ReactDOM from 'react-dom/client';
import Notifications from './components/Notifications';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<>
		<Notifications />
		<App />
	</>
);
