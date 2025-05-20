import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  uploadImage,
  createArticle,
  updateArticle,
  deleteImage,
  getArticle,
} from "../firebase/db";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/create-post.css";

const CreatePostPage = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    imageRefs: [],
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    if (isEdit && id) {
      const fetchArticle = async () => {
        try {
          const article = await getArticle(id);
          setFormData({
            title: article.title,
            text: article.text,
            imageRefs: article.imageRefs,
          });
          setPreviewUrls(article.imgs);
          setUploadedImages(
            article.imageRefs.map((ref, index) => ({
              id: ref,
              name: `Image ${index + 1}`,
            }))
          );
        } catch (err) {
          console.error("Error fetching article:", err);
          setError("Помилка при завантаженні статті");
        }
      };

      fetchArticle();
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      await handleImageUpload({ target: { files } });
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLoading(true);
    setError("");

    try {
      
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

      const uploadPromises = files.map(async (file) => {
        const imageId = await uploadImage(file);
        return {
          id: imageId,
          name: file.name,
          size: file.size,
          type: file.type,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...uploadedFiles]);
      setFormData((prev) => ({
        ...prev,
        imageRefs: [...prev.imageRefs, ...uploadedFiles.map((file) => file.id)],
      }));
    } catch (err) {
      console.error("Error uploading images:", err);
      setError("Помилка при завантаженні зображень. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    try {
      
      const imageId = uploadedImages[index].id;

      
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        imageRefs: prev.imageRefs.filter((_, i) => i !== index),
      }));

      
      await deleteImage(imageId);
    } catch (err) {
      console.error("Error removing image:", err);
      setError("Помилка при видаленні зображення. Спробуйте ще раз.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (formData.imageRefs.length === 0) {
        setError("Будь ласка, завантажте хоча б одне зображення");
        setLoading(false);
        return;
      }

      if (isEdit) {
        await updateArticle(id, formData);
        navigate(`/article/${id}`);
      } else {
        const articleId = await createArticle(formData);
        navigate(`/article/${articleId}`);
      }
    } catch (err) {
      console.error("Error saving post:", err);
      setError(
        isEdit
          ? "Помилка при оновленні допису. Спробуйте ще раз."
          : "Помилка при створенні допису. Спробуйте ще раз."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title={isEdit ? "Редагувати допис" : "Створити новий допис"} />
      <main className="create-post-container">
        <form className="create-post-form" onSubmit={handleSubmit}>
          <div className="text-column">
            <div className="form-group">
              <label htmlFor="title">Заголовок</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Введіть заголовок"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="text">Текст</label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="Введіть текст допису"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="right-column">
            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={loading || formData.imageRefs.length === 0}
              >
                {loading
                  ? isEdit
                    ? "Оновлення..."
                    : "Створення..."
                  : isEdit
                  ? "Оновити допис"
                  : "Створити допис"}
              </button>
            </div>

            <div className="image-column">
              <div className="form-group">
                <label>
                  Зображення <span style={{ color: "red" }}>*</span>
                </label>
                <div
                  className="image-upload-container"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    disabled={loading}
                    style={{ display: "none" }}
                  />
                  <div className="upload-label">Вибрати зображення</div>
                  <p
                    style={{
                      marginTop: "1rem",
                      color: "var(--base-font-color)",
                    }}
                  >
                    Перетягніть файли сюди або натисніть для вибору
                  </p>
                </div>

                {previewUrls.length > 0 && (
                  <div className="image-preview">
                    <h4>Завантажені зображення:</h4>
                    <div className="preview-grid">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="preview-item">
                          <img src={url} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-image"
                            onClick={() => handleRemoveImage(index)}
                            disabled={loading}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </form>
      </main>
      <Footer />
    </>
  );
};

export default CreatePostPage;
