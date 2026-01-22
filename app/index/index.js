document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = document.querySelector(".modal-close");

  const likeBtn = document.getElementById("likeBtn");
  const likeCount = document.getElementById("likeCount");

  const commentList = document.getElementById("commentList");
  const commentText = document.getElementById("commentText");
  const addCommentBtn = document.getElementById("addCommentBtn");

  // LocalStorage 기반 
  const STORAGE_KEY = "postDataDB";

  function loadDB() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  }

  function saveDB(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  let postDB = loadDB();
  let currentPostSrc = null;

  // 이벤트 위임
  document.body.addEventListener("click", (e) => {
    const img = e.target.closest(".post img");
    if (!img) return;

    const src = img.src;
    currentPostSrc = src;

    if (!postDB[src]) {
      postDB[src] = { likes: 0, comments: [] };
      saveDB(postDB);
    }

    const data = postDB[src];

    modal.classList.add("show");
    modalImg.src = src;

    likeCount.textContent = data.likes;
    likeBtn.classList.toggle("liked", data.likes > 0);

    renderComments(data.comments);
  });

  // 닫기
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove("show");
    currentPostSrc = null;
  }

  // 좋아요
  likeBtn.addEventListener("click", () => {
    if (!currentPostSrc) return;

    const data = postDB[currentPostSrc];
    data.likes = data.likes ? 0 : 1;

    likeCount.textContent = data.likes;
    likeBtn.classList.toggle("liked", data.likes > 0);

    saveDB(postDB);
  });

  // 댓글
  addCommentBtn.addEventListener("click", addComment);
  commentText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addComment();
  });

  function addComment() {
    if (!currentPostSrc) return;

    const text = commentText.value.trim();
    if (!text) return;

    postDB[currentPostSrc].comments.push(text);
    saveDB(postDB);

    renderComments(postDB[currentPostSrc].comments);
    commentText.value = "";
  }

  function renderComments(comments) {
    commentList.innerHTML = "";
    comments.forEach(text => {
      const div = document.createElement("div");
      div.className = "comment-item";
      div.textContent = text;
      commentList.appendChild(div);
    });
  }

});

document.addEventListener("DOMContentLoaded", () => {

  const createBtn = document.getElementById("createBtn");
  const fileInput = document.getElementById("fileInput");

  createBtn?.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      // 기존 게시물 불러오기
      const posts = JSON.parse(localStorage.getItem("posts") || "[]");

      // 새 게시물 추가
      posts.unshift({
        img: imageData,
        likes: 0,
        comments: [],
        date: Date.now()
      });

      localStorage.setItem("posts", JSON.stringify(posts));

      alert("게시물이 추가되었습니다! 📸");
      location.reload();
    };

    reader.readAsDataURL(file);
  });

});
