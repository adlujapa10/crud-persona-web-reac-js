import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import NavigationBar from './components/Navbar';
import Home from './components/Home';
import PersonaList from './components/PersonaList';
import PersonaForm from './components/PersonaForm';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/personas" element={<PersonaList />} />
            <Route path="/personas/nueva" element={<PersonaForm />} />
            <Route path="/personas/editar/:id" element={<PersonaForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
