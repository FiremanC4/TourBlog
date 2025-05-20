import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { getImageUrl } from "../utils/static";
// import "../styles/header-footer.css";

function Header({ title, sort, sortValue, onSortChange }) {
  const { userLoggedIn } = useAuth();

  return (
    <header className="header">
      <div className="top-header">
        <Link className="site-title" to="/">
          <img src={getImageUrl("icons/icon.png")} alt="Logo" className="site-logo" />
          <p className="site-name">TourBlog</p>
        </Link>
        <nav className="navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-item-a">
                Статті
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/help" className="nav-item-a">
                Довідка
              </Link>
            </li>
            {userLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/create-post" className="nav-item-a">
                    Новий допис
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-item-a">
                    Профіль
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-item-a">
                    Увійти
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-item-a">
                    Реєстрація
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      {title && (
        <div className="bottom-header">
          <h1 className="bottom-header-text">{title}</h1>
          {sort && (
            <select
              className="sort-select"
              value={sortValue}
              onChange={onSortChange}
            >
              <option value="id">За ID</option>
              <option value="date">За датою</option>
              <option value="likes">За лайками</option>
            </select>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
