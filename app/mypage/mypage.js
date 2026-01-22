document.addEventListener("DOMContentLoaded", () => {

    const posts = document.querySelectorAll(".post img");

    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.querySelector(".modal-close");

    const likeBtn = document.getElementById("likeBtn");
    const likeCount = document.getElementById("likeCount");

    const commentList = document.getElementById("commentList");
    const commentText = document.getElementById("commentText");
    const addCommentBtn = document.getElementById("addCommentBtn");

    // 게시물별 상태 저장
    const postData = new Map();
    let currentPostSrc = null;

    // 게시물 클릭 → 모달 열기
    posts.forEach(img => {
        postData.set(img.src, {
            likes: 0,
            comments: []
        });

        img.addEventListener("click", () => {
            modal
                .classList
                .add("show"); // 🔥 핵심
            modalImg.src = img.src;
            currentPostSrc = img.src;

            const data = postData.get(currentPostSrc);

            likeCount.textContent = data.likes;
            likeBtn
                .classList
                .toggle("liked", data.likes > 0);

            renderComments(data.comments);
        });
    });

    // 닫기 버튼
    closeBtn.addEventListener("click", closeModal);

    // 바깥 클릭 시 닫기
    modal.addEventListener("click", (e) => {
        if (e.target === modal) 
            closeModal();
        }
    );

    function closeModal() {
        modal
            .classList
            .remove("show"); // 🔥 핵심
        currentPostSrc = null;
    }

    // 좋아요
    likeBtn.addEventListener("click", () => {
        if (!currentPostSrc) 
            return;
        
        const data = postData.get(currentPostSrc);

        data.likes = data.likes
            ? 0
            : 1;

        likeCount.textContent = data.likes;
        likeBtn
            .classList
            .toggle("liked", data.likes > 0);
    });

    // 댓글 버튼
    addCommentBtn.addEventListener("click", addComment);

    // 엔터 등록
    commentText.addEventListener("keydown", (e) => {
        if (e.key === "Enter") 
            addComment();
        }
    );

    function addComment() {
        if (!currentPostSrc) 
            return;
        
        const text = commentText
            .value
            .trim();
        if (!text) 
            return;
        
        const data = postData.get(currentPostSrc);
        data
            .comments
            .push(text);

        renderComments(data.comments);
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

    // 게시물 수
    const db = JSON.parse(localStorage.getItem("postDataDB")) || {};
    const feedCnt = Object
        .keys(db)
        .length;


    document.getElementById("feedCnt").textContent = feedCnt;
});

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("postGrid");
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");

    posts.forEach(post => {
        const div = document.createElement("div");
        div.className = "post";

        const img = document.createElement("img");
        img.src = post.img;

        div.appendChild(img);
        grid.appendChild(div);
    });
});
