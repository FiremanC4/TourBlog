function Comment({ author, text }) {
  return (
    <div className="comment">
      <p>
        <strong>{author}:</strong> {text}
      </p>
    </div>
  );
}

export default Comment;
