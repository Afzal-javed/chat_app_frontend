import './App.css';
import Dashboard from './modules/Dashboard';
import Form from './modules/Form';
import { Routes, Route, Navigate } from 'react-router-dom';
import Update from './modules/Update/Update';
import AllUsers from './modules/AllUsers/AllUsers';
import ChatPage from './modules/ChatPage/ChatPage';
const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;
  if (!isLoggedIn && auth) {
    return <Navigate to="/users/sign_in" />;
  } else if (isLoggedIn && ['/users/sign_in', '/users/sign_up'].includes(window.location.pathname)) {
    return <Navigate to="/" />;
  }
  return children;
};
function App() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute auth={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path='/users/sign_in' element={
        <ProtectedRoute>
          <Form isSignInPage={true} />
        </ProtectedRoute>
      } />
      <Route path='/users/sign_up' element={
        <ProtectedRoute>
          <Form isSignInPage={false} />
        </ProtectedRoute>
      } />
      <Route path='/users/update' element={
        <ProtectedRoute>
          <Update />
        </ProtectedRoute>
      } />
      <Route path='/allusers' element={
        <ProtectedRoute>
          <AllUsers />
        </ProtectedRoute>
      } />
      <Route path="/chat/:userId" element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      } />
    </Routes>

  );
}
export default App;
