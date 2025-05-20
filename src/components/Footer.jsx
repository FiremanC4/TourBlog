import { getImageUrl } from "../utils/static";
import "../styles/header-footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p className="copyright">
        &copy; 2025 TourBlog. <br /> Всі права захищені.
      </p>
      <p className="author-name">FiremanC4</p>
      <a href="https://github.com/FiremanC4" className="github-link">
        <img
          src={getImageUrl("icons/github-mark/github-mark.png")}
          alt="github"
          className="github-icon"
        />
      </a>
    </footer>
  );
}

export default Footer;
