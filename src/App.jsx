import React from 'react';
import { UserAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import DashboardLayout from './components/Layout/DashboardLayout';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import Home from './pages/Home';
import About from './pages/About';
import Jobs from './pages/Jobs';
import Connect from './pages/Connect';
import Terms from './pages/Terms';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import Settings from './pages/Settings';
import CompleteProfile from './components/auth/CompleteProfile';
import Dashboard from './admin/Dashboard';
import JobDetails from './components/views/JobDetails';
import UserPortal from './admin/UserPortal';
import JobPortal from './admin/JobPortal';
import AssignBadge from './admin/AssignBadge';
import DataSettings from './admin/DataSettings';
import StartReports from './admin/StartReports';
import Subscribe from './pages/Subscribe';
import AssignBadgeForm from './components/forms/AssignBadgeForm';
import Test from './admin/Test';

function App() {
  const { user } = UserAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes without MainLayout */}
        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
        <Route path="/signin" element={<PublicRoute element={<SignIn />} />} />

        {/* Public routes with MainLayout */}
        <Route path="/" element={<MainLayout><Home/></MainLayout>} />
        <Route path="/jobs" element={<MainLayout><Jobs /></MainLayout>} />
        <Route path="/jobs/:slug" element={<MainLayout><JobDetails /></MainLayout>} />
        <Route path="/subscribe" element={<MainLayout><Subscribe /></MainLayout>} />
        <Route path="/connect" element={<MainLayout><Connect /></MainLayout>} />
        <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/assignadge" element={<MainLayout><AssignBadgeForm /></MainLayout>} />

        {/* Private routes with MainLayout */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Navigate to={`/profile/${user?.userName}`} />} /> {/* Use optional chaining to handle null user */}
          <Route path="/profile/:userName" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          <Route path="/completeprofile" element={<CompleteProfile />} />
        </Route>

        {/* Admin route */}
        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/userportal" element={<DashboardLayout><UserPortal /></DashboardLayout>} />
          <Route path="/assignbadge" element={<DashboardLayout><AssignBadge /></DashboardLayout>} />
          <Route path="/jobportal" element={<DashboardLayout><JobPortal /></DashboardLayout>} />
          <Route path="/stat-reports" element={<DashboardLayout><StartReports /></DashboardLayout>} />
          <Route path="/data-settings" element={<DashboardLayout><DataSettings /></DashboardLayout>} />
          <Route path="/test-dashboard" element={<DashboardLayout><Test /></DashboardLayout>} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
