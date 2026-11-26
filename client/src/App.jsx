import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Admin from './pages/Admin.jsx';
import Checkout from './pages/Checkout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import Library from './pages/Library.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Policies from './pages/Policies.jsx';
import PromptDetail from './pages/PromptDetail.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:slug" element={<PromptDetail />} />
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/register" element={<Login mode="register" />} />
        <Route path="/policies" element={<Policies />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/checkout"
          element={<ProtectedRoute><Checkout /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
