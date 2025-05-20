import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ArticleContainer from "../components/ArticleContainer";
import SkeletonArticle from "../components/SkeletonArticle";
import { getArticles } from "../firebase/db";
import "../styles/main.css"; 

const IndexPage = () => {
  const [sortBy, setSortBy] = useState("id");
  const [articles, setArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesData = await getArticles();
        setArticles(articlesData);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Помилка при завантаженні статей");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <>
        <Header title="Статті" />
        <main>
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
        <Header title="Статті" />
        <main>
          <div className="error">{error}</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header
        title="Статті"
        sort
        sortValue={sortBy}
        onSortChange={(e) => setSortBy(e.target.value)}
      />

      <main>
        <ArticleContainer articles={articles} sortBy={sortBy} />
      </main>
      <Footer />
    </>
  );
};

export default IndexPage;
