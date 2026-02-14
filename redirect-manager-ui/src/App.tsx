import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Redirects from './components/pages/Redirects';
import CreateRedirect from './components/pages/CreateRedirect';
import EditRedirect from './components/pages/EditRedirect';
import RedirectDetailView from './components/pages/RedirectDetailView';
import ApiTokens from './components/pages/ApiTokens';
import CreateApiToken from './components/pages/CreateApiToken';
import Users from './components/pages/Users';
import CreateUser from './components/pages/CreateUser';
import Account from './components/pages/Account';
import Login from './components/pages/Login';
import ProtectedRoute from './components/routing/ProtectedRoute';
import { AuthService } from './services/auth.service';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            AuthService.isAuthenticated() ? (
              <Navigate to="/redirects" replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route
          path="/redirects"
          element={
            <ProtectedRoute>
              <Redirects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/redirects/create"
          element={
            <ProtectedRoute>
              <CreateRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/redirects/:id/edit"
          element={
            <ProtectedRoute>
              <EditRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/redirects/:id"
          element={
            <ProtectedRoute>
              <RedirectDetailView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tokens"
          element={
            <ProtectedRoute>
              <ApiTokens />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tokens/create"
          element={
            <ProtectedRoute>
              <CreateApiToken />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <ProtectedRoute>
              <CreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/redirects" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
