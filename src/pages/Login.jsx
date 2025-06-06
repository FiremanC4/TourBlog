import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../firebase/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Будь ласка, заповніть всі поля");
      setLoading(false);
      return;
    }

    try {
      await doSignInWithEmailAndPassword(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      let errMsg = err.code
      if (err.code == "auth/invalid-credential"){
        errMsg = "Неправильний логін або пароль";
      } else if (err.code == "auth/user-not-found"){
        errMsg = "Користувача не знайдено";
      } else if (err.code == "auth/wrong-password"){
        errMsg = "Неправильний пароль";
      } else if (err.code == "auth/too-many-requests"){
        errMsg = "Забагато запитів. Спробуйте пізніше.";
      } else if (err.code == "auth/operation-not-allowed"){
        errMsg = "Ця операція не дозволена";
      } else if (err.code == "auth/invalid-email"){
        errMsg = "Неправильний email";
      } else if (err.code == "auth/user-disabled"){
        errMsg = "Користувач заблокований";
      } else if (err.code == "auth/weak-password"){
        errMsg = "Слабкий пароль";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await doSignInWithGoogle();

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Увійти</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введіть email"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введіть пароль"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Вхід..." : "Увійти"}
          </button>
          <div className="divider">
            <span>або</span>
          </div>
          <button
            type="button"
            className="google-button"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="google-icon"
            />
            Увійти через Google
          </button>
          <div className="auth-link">
            Немає акаунту? <Link to="/register">Зареєструватися</Link>
          </div>
          <div className="auth-link">
            <Link to="/reset-password">Забули пароль?</Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
