import { createBrowserRouter } from 'react-router-dom';
import CreatePage from './pages/Create';
import HomePage from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/create',
    element: <CreatePage />,
  },
]);

export default router;
