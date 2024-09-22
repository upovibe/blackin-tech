import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import AdminLayout from './components/Layout/AdminLayout';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import Home from './pages/Home';
import About from './pages/About';
import Jobs from './pages/Jobs';
import Nodes from './pages/Nodes';
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
import DataSettings from './admin/DataSettings';
import StartReports from './admin/StartReports';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes without MainLayout */}
        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
        <Route path="/signin" element={<PublicRoute element={<SignIn />} />} />

        {/* Public routes with MainLayout */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/jobs" element={<MainLayout><Jobs /></MainLayout>} />
        <Route path="/jobs/:slug" element={<MainLayout><JobDetails /></MainLayout>} />
        <Route path="/nodes" element={<MainLayout><Nodes /></MainLayout>} />
        <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />

        {/* Private routes with MainLayout */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/profile/:userName" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          <Route path="/completeprofile" element={<CompleteProfile />} />
        </Route>

        {/* Admin route */}
        <Route element={<PrivateRoute requiredRole="admin" />}>
          <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/userportal" element={<AdminLayout><UserPortal /></AdminLayout>} />
          <Route path="/jobportal" element={<AdminLayout><JobPortal /></AdminLayout>} />
          <Route path="/stat-reports" element={<AdminLayout><StartReports /></AdminLayout>} />
          <Route path="/data-settings" element={<AdminLayout><DataSettings /></AdminLayout>} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
