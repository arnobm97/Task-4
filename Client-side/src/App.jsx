// src/App.js

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UserManagement from './pages/UserManagement';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/user-management" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/user-management" />} />
        <Route path="/user-management" element={isAuthenticated ? <UserManagement /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/user-management" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
