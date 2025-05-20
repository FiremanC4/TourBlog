import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/help.css";

const HelpPage = () => {
  return (
    <>
      <Header />
      <main className="help-container">
        <section className="help-content">
          <h1>Про TourBlog</h1>
          <div className="help-section">
            <h2>Що таке TourBlog?</h2>
            <p>
              TourBlog - це платформа для поділу враженнями про подорожі та
              місця, які ви відвідали. Тут ви можете створювати статті, ділитися
              фотографіями та читати про пригоди інших мандрівників.
            </p>
          </div>

          <div className="help-section">
            <h2>Основні функції</h2>
            <ul>
              <li>
                <strong>Читання статей:</strong> Переглядайте статті інших
                користувачів, сортуйте їх за датою або кількістю лайків
              </li>
              <li>
                <strong>Створення статей:</strong> Після реєстрації ви можете
                створювати власні статті з текстом та фотографіями
              </li>
              <li>
                <strong>Взаємодія:</strong> Ставте лайки статтям, які вам
                сподобалися
              </li>
              <li>
                <strong>Профіль:</strong> Керуйте своїми статтями, редагуйте та
                видаляйте їх
              </li>
            </ul>
          </div>

          <div className="help-section">
            <h2>Як почати?</h2>
            <ol>
              <li>
                Зареєструйтеся на сайті або увійдіть, якщо вже маєте акаунт
              </li>
              <li>Переглядайте статті інших користувачів</li>
              <li>Створюйте власні статті про ваші подорожі</li>
              <li>Взаємодійте з іншими користувачами через систему лайків</li>
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HelpPage;
