import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";
import { getUser, getArticlesByAuthor, deleteArticle } from "../firebase/db";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ArticleContainer from "../components/ArticleContainer";
import SkeletonArticle from "../components/SkeletonArticle";
import "../styles/profile.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();
  const [sortBy, setSortBy] = useState("id");
  const [articles, setArticles] = useState({});
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const [userData, userArticles] = await Promise.all([
            getUser(),
            getArticlesByAuthor(),
          ]);

          setUserData(userData);
          setArticles(userArticles);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Помилка при завантаженні даних");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDelete = async (idToDelete) => {
    try {
      await deleteArticle(idToDelete);
      setArticles((prev) => {
        const newArticles = { ...prev };
        delete newArticles[idToDelete];
        return newArticles;
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      setError("Помилка при видаленні статті");
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Мій профіль" />
        <main className="profile-container">
          <aside className="profile-sidebar">
            <h2>Моя інформація</h2>
            <div className="skeleton-info">
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
            </div>
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </aside>
          <section id="article-container">
            {[...Array(4)].map((_, index) => (
              <SkeletonArticle key={index} />
            ))}
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Мій профіль" />
        <main className="profile-container">
          <div className="error">{error}</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header
        title="Мій профіль"
        sort
        sortValue={sortBy}
        onSortChange={(e) => setSortBy(e.target.value)}
      />

      <main className="profile-container">
        <aside className="profile-sidebar">
          <h2>Моя інформація</h2>
          <p>
            <strong>Ім'я:</strong> {userData?.username || "Не вказано"}
          </p>
          <p>
            <strong>Email:</strong> {currentUser?.email || "Не вказано"}
          </p>
          <p>
            <strong>Дата реєстрації:</strong>{" "}
            {userData?.createdAt
              ? new Date(userData.createdAt).toLocaleDateString()
              : "Не вказано"}
          </p>
          <button
            className="new-post-btn"
            onClick={() => navigate("/create-post")}
          >
            Новий допис
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Вийти
          </button>
        </aside>

        <ArticleContainer
          articles={articles}
          sortBy={sortBy}
          isProfile={true}
          onDelete={handleDelete}
        />
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
