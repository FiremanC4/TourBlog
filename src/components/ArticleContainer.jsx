import React from "react";
import Article from "./ArticleCard";
import "../styles/article.css";

const ArticleContainer = ({
  articles,
  sortBy,
  isProfile = false,
  onDelete,
}) => {
  
  const sortedArticles = Object.entries(articles).sort((a, b) => {
    const [idA, articleA] = a;
    const [idB, articleB] = b;

    switch (sortBy) {
      case "likes":
        return articleB.likes - articleA.likes;
      case "date":
        return new Date(articleB.date) - new Date(articleA.date);
      default:
        return idA - idB;
    }
  });

  return (
    <section id="article-container">
      {sortedArticles.map(([id, article]) => (
        <Article
          key={id}
          id={id}
          article={article}
          isProfile={isProfile}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};

export default ArticleContainer;
