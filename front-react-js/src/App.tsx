import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import NavigationBar from './components/Navbar';
import Home from './components/Home';
import PersonaList from './components/PersonaList';
import PersonaForm from './components/PersonaForm';
import UsuarioList from './components/UsuarioList';
import UsuarioForm from './components/UsuarioForm';
import ProductoList from './components/ProductoList';
import ProductoForm from './components/ProductoForm';
import FacturaList from './components/FacturaList';
import FacturaForm from './components/FacturaForm';
import Reportes from './components/Reportes';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta pública para login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <Home />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/personas" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <PersonaList />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/personas/nueva" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <PersonaForm />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/personas/editar/:id" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <PersonaForm />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          {/* Rutas de Usuarios */}
          <Route path="/usuarios" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <UsuarioList />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/usuarios/nuevo" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <UsuarioForm />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/usuarios/editar/:id" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <UsuarioForm />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          {/* Rutas de Productos */}
          <Route path="/productos" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <ProductoList />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/productos/nuevo" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <ProductoForm />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/productos/editar/:id" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <ProductoForm />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          {/* Rutas de Facturas */}
          <Route path="/facturas" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <FacturaList />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/facturas/nueva" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <FacturaForm />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/facturas/editar/:id" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <FacturaForm />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          {/* Rutas de Reportes */}
          <Route path="/reportes" element={
            <ProtectedRoute>
              <>
                <NavigationBar />
                <main>
                  <Reportes />
                </main>
              </>
            </ProtectedRoute>
          } />
          
          {/* Redirigir a login si no encuentra la ruta */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
