import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/Registration';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route - redirect to registration or login */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          
          {/* Registration page */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Add other routes as needed */}
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;