// src/routes/Routes.jsx
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import RootLayout from '../layouts/RootLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

// Public Pages
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Forbidden from '../pages/Forbidden.jsx';
import ErrorPage from '../pages/ErrorPage.jsx';

// Role Routes
import AdminHome from '../pages/Dashboard/Admin/AdminHome.jsx';
import BuyerHome from '../pages/Dashboard/Buyer/BuyerHome.jsx';

// Buyer Routes
import AddTask from '../pages/Dashboard/Buyer/AddTask.jsx';
import MyTasks from '../pages/Dashboard/Buyer/MyTasks.jsx';
import PurchaseCoin from '../pages/Dashboard/Buyer/PurchaseCoin.jsx';
import PaymentHistory from '../pages/Dashboard/Buyer/PaymentHistory.jsx';

// Worker Routes
import WorkerHome from '../pages/Dashboard/Worker/WorkerHome.jsx';
import TaskList from '../pages/Dashboard/Worker/TaskList.jsx';
import MySubmissions from '../pages/Dashboard/Worker/MySubmissions.jsx';
import Withdrawals from '../pages/Dashboard/Worker/Withdrawals.jsx';

// Admin Routes
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers.jsx';
import ManageTasks from '../pages/Dashboard/Admin/ManageTasks.jsx';

// Route Guards
import PrivateRoute from '../routes/SecretRoutes/PrivateRoute.jsx';
import AdminRoute from '../routes/SecretRoutes/AdminRoute.jsx';
import BuyerRoute from '../routes/SecretRoutes/BuyerRoute.jsx';
import WorkerRoute from '../routes/SecretRoutes/WorkerRoute.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forbidden', element: <Forbidden /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Worker Routes
      { path: 'worker-home', element: <WorkerHome /> },
      { path: 'task-list', element: <TaskList /> },
      { path: 'my-submissions', element: <MySubmissions /> },
      { path: 'withdrawals', element: <Withdrawals /> },

      // Buyer Routes
      { path: 'buyer-home', element: <BuyerHome /> },
      { path: 'add-task', element: <AddTask /> },
      { path: 'my-tasks', element: <MyTasks />},
      { path: 'purchase-coin', element: <PurchaseCoin /> },
      { path: 'payment-history', element: <PaymentHistory /> },

      // Admin Routes
      { path: 'admin-home', element: <AdminHome /> },
      { path: 'manage-users', element: <ManageUsers />},
      { path: 'manage-tasks', element: <ManageTasks /> },
    ],
  },
]);
