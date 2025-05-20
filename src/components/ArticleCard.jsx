import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toggleLike, listenToLikes } from "../firebase/db";
import { auth } from "../firebase/firebase";
import { getImageUrl } from "../utils/static";
import "../styles/article.css";

function ArticleCard({ article, id, isProfile = false, onDelete }) {
  const navigate = useNavigate();

  if (article.imgs === undefined) {
    return <div>Undefinded</div>;
  }

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(article.likes || 0);
  const [deleteRequested, setDeleteRequested] = useState(false);

  useEffect(() => {
    let unsubscribe = null;

    const setupWebSocket = async () => {
      unsubscribe = await listenToLikes(id, ({ count, isLiked }) => {
        setLikes(count);
        setIsLiked(isLiked);
      });
    };

    setupWebSocket();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id]);

  const handleLike = async () => {
    if (!auth.currentUser) {
      navigate("/login");
    }

    try {
      await toggleLike(id);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDelete = () => {
    if (deleteRequested) {
      onDelete(id);
    } else {
      setDeleteRequested(true);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  return (
    <article className={`article ${isProfile ? "article-profile" : ""}`}>
      <img src={article.imgs[0]} className="article-img" alt="Article" />
      <h2 className="article-title">{article.title}</h2>
      <p className="article-description">{article.text.substring(0, 150)}</p>
      <Link className="article-read-btn" to={`/article/${id}`}>
        Читати
      </Link>
      <div className="article-bottom-container">
        <div className="article-likes">
          <button className="article-like-button" onClick={handleLike}>
            <img
              src={
                isLiked
                  ? getImageUrl("icons/like-filled.png")
                  : getImageUrl("icons/like-empty.png")
              }
              className="article-like-img"
              alt="Like"
            />
          </button>
          <span className="article-like-counter">{likes}</span>
        </div>
        <time className="article-date">{article.date}</time>
      </div>
      {isProfile && (
        <div className="article-actions">
          <button className="edit-btn" onClick={handleEdit}>
            Редагувати
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            {deleteRequested ? "Підтвердіть" : "Видалити"}
          </button>
        </div>
      )}
    </article>
  );
}

export default ArticleCard;
