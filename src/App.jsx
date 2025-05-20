import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/authContext";
import IndexPage from "./pages/IndexPage";
import ProfilePage from "./pages/ProfilePage";
import ArticleViewPage from "./pages/ArticleViewPage";
import CreatePostPage from "./pages/CreatePostPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HelpPage from "./pages/HelpPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./styles/main.css";
import "./styles/header-footer.css";

const ProtectedRoute = ({ children }) => {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <p>Завантаження...</p>
        </div>
      </div>
    );
  }

  return userLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/TourBlog">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/article/:id" element={<ArticleViewPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/help" element={<HelpPage />} />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <CreatePostPage isEdit={true} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
