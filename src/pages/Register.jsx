import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { addUser } from "../firebase/db";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.nickname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Будь ласка, заповніть всі поля");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Паролі не співпадають");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await doCreateUserWithEmailAndPassword(
        formData.email,
        formData.password
      );
      await addUser();
      navigate("/login");
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

  return (
    <>
      <Header />
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Реєстрація</h2>
          <div className="form-group">
            <label htmlFor="nickname">Ім'я користувача</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="Введіть ім'я користувача"
              required
              disabled={loading}
            />
          </div>
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
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Підтвердіть пароль</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Введіть пароль ще раз"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Реєстрація..." : "Зареєструватися"}
          </button>
          <div className="auth-link">
            Вже маєте акаунт? <Link to="/login">Увійти</Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;
