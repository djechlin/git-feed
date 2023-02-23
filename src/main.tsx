import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FeedPage } from './FeedPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div><h1>404 - Page not found.</h1></div>
  },
  {
    path: '/:user/:repo',
    element: <FeedPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
