import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout'
import Home from './pages/Home';
import About from './pages/About';
import Jobs from './pages/Jobs';
import Terms from './pages/Terms';
import SearchPage from './pages/SearchPage';
import SignUp from './pages/SignUp';

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/search" element={<MainLayout><SearchPage /></MainLayout>} />
        <Route path="/jobs" element={<MainLayout><Jobs /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />
      </Routes>
    </>
  )
}

export default App
