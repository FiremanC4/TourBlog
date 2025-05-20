import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SkeletonArticleView from "../components/SkeletonArticleView";
import {
  getArticle,
  addComment,
  listenToComments,
  toggleLike,
  listenToLikes,
} from "../firebase/db";
import { auth } from "../firebase/firebase";
import { getImageUrl } from "../utils/static";
import "../styles/article-view.css";

const ArticleViewPage = () => {
  const { id } = useParams();
  const [mainImg, setMainImg] = useState(null);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleData = await getArticle(id);
        setArticle(articleData);
        if (articleData.imgs && articleData.imgs.length > 0) {
          setMainImg(articleData.imgs[0]);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Помилка при завантаженні статті");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();

    const unsubscribeComments = listenToComments(id, (comments) => {
      setArticle((prev) => ({
        ...prev,
        comments: comments,
      }));
    });

    let unsubscribeLikes = null;
    const setupLikes = async () => {
      unsubscribeLikes = await listenToLikes(id, ({ count, isLiked }) => {
        setLikesCount(count);
        setIsLiked(isLiked);
      });
    };
    setupLikes();

    return () => {
      unsubscribeComments();
      if (unsubscribeLikes) {
        unsubscribeLikes();
      }
    };
  }, [id]);

  const handleLike = async () => {
    if (!auth.currentUser) {
      setCommentError("Будь ласка, увійдіть, щоб поставити лайк");
      return;
    }

    try {
      await toggleLike(id);
    } catch (error) {
      console.error("Error toggling like:", error);
      setCommentError("Помилка при додаванні лайка");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const textarea = e.target.elements.comment;
    const commentText = textarea.value.trim();

    if (!commentText) return;

    try {
      if (!auth.currentUser) {
        setCommentError("Будь ласка, увійдіть, щоб залишити коментар");
        return;
      }

      await addComment(id, commentText);
      textarea.value = "";
      setCommentError(null);
    } catch (err) {
      console.error("Error adding comment:", err);
      setCommentError("Помилка при додаванні коментаря");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main>
          <SkeletonArticleView />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Header />
        <main className="article-view-container">
          <div className="error">{error || "Стаття не знайдена"}</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="article-view-container">
        <article className="article-content">
          <div className="article-gallery">
            <img src={mainImg} className="gallery-img" alt="Головне фото" />
            <div className="gallery-thumbnails">
              {article.imgs.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="thumbnail-img"
                  onClick={() => setMainImg(img)}
                  alt={`thumbnail-${index}`}
                />
              ))}
            </div>
          </div>
          <h1 className="article-view-title">{article.title}</h1>
          <div className="article-text">{article.text}</div>
        </article>

        <aside className="comments-section">
          <div className="interactions-section">
            <h2>Коментарі</h2>
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
              <span className="article-like-counter">{likesCount}</span>
            </div>
          </div>
          {commentError && <div className="error">{commentError}</div>}
          <div id="comments-container">
            {article.comments &&
              article.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <p>
                    <strong>{comment.author.username}:</strong> {comment.text}
                  </p>
                  <small>{new Date(comment.createdAt).toLocaleString()}</small>
                </div>
              ))}
          </div>
          <form id="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              name="comment"
              placeholder="Напишіть коментар..."
              required
            />
            <button type="submit" className="comment-btn">
              Опублікувати
            </button>
          </form>
        </aside>
      </main>
      <Footer />
    </>
  );
};

export default ArticleViewPage;
