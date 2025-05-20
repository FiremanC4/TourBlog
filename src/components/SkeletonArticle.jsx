import React from "react";
import "../styles/skeletonArticle.css";

const SkeletonArticle = () => {
  return (
    <article className="skeleton-article">
      <div className="skeleton-image"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-description"></div>
      <div className="skeleton-read-btn"></div>
      <div className="skeleton-bottom">
        <div className="skeleton-likes"></div>
        <div className="skeleton-date"></div>
      </div>
    </article>
  );
};

export default SkeletonArticle;
