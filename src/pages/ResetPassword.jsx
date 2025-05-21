import React, { useState } from "react";
import { doPasswordReset } from "../firebase/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/auth.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Будь ласка, введіть email");
      setLoading(false);
      return;
    }

    try {
      await doPasswordReset(email);
      setSuccess("Інструкції для скидання паролю надіслано на вашу пошту.");
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
          <h2>Скидання паролю</h2>
          <div className="form-group">
            <label htmlFor="email">Пошта</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Введіть вашу пошту"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Відправка..." : "Надіслати скидання паролю"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;
