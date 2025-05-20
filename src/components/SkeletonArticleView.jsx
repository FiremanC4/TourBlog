import React from "react";
import "../styles/skeleton-article-view.css";

const SkeletonArticleView = () => {
  return (
    <div className="article-view-container">
      <article className="article-content skeleton">
        <div className="article-gallery skeleton">
          <div className="gallery-img skeleton"></div>
          <div className="gallery-thumbnails skeleton">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="thumbnail-img skeleton"></div>
            ))}
          </div>
        </div>
        <div className="article-view-title skeleton"></div>
        <div className="article-text skeleton">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="text-line skeleton"></div>
          ))}
        </div>
      </article>

      <aside className="comments-section skeleton">
        <div className="interactions-section skeleton">
          <div className="comments-title skeleton"></div>
          <div className="article-likes skeleton">
            <div className="article-like-button skeleton"></div>
            <div className="article-like-counter skeleton"></div>
          </div>
        </div>
        <div className="comments-container skeleton">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="comment skeleton">
              <div className="comment-author skeleton"></div>
              <div className="comment-text skeleton"></div>
              <div className="comment-date skeleton"></div>
            </div>
          ))}
        </div>
        <div className="comment-form skeleton">
          <div className="comment-textarea skeleton"></div>
          <div className="comment-submit skeleton"></div>
        </div>
      </aside>
    </div>
  );
};

export default SkeletonArticleView;
