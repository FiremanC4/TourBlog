import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";
import "../styles/auth.css"; // Assuming this style is similar to other pages

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="error-title">404</h1>
      <p className="error-message">Page Not Found</p>
      <button
        onClick={() => navigate("/")}
        className="btn-primary"
      >
        Go to Home Page
      </button>
    </div>
  );
};

export default NotFoundPage;