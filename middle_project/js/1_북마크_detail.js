const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

fetch("js/1_북마크_detail.json")
  .then(res => res.json())
  .then(data => {
    const book = data.find(item => item.id == bookId);
    if (!book) {showCustomAlert("책 정보를 찾을 수 없습니다.");
        const okBtn = document.getElementById('modal-ok-btn');
        const modal = document.getElementById('custom-modal');
        if (okBtn) {okBtn.onclick = function() {
                if (modal) modal.classList.remove('show');
                window.history.back(); 
              };
        }
        return;
    }

    // 기본 정보
    document.getElementById("book-title").textContent = book.title;
    document.getElementById("book-author").textContent = book.author;
    document.getElementById("book-publisher").textContent = book.publisher;

    // 이미지
    document.getElementById("book-cover").src = book.cover;
    document.getElementById("info-image").src = book.info_image;

    // 가격
    document.getElementById("sale-price").textContent =
      book.sale_price.toLocaleString() + "원";
    document.getElementById("original-price").textContent =
      book.original_price.toLocaleString() + "원";
    document.getElementById("discount-rate").textContent = book.discount_rate;

    // 포인트
    document.getElementById("point").textContent = book.point + "P";
    
    // 배송
    const arrivalDateElement = document.getElementById("arrival-date");
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 2);
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = daysOfWeek[targetDate.getDay()];
    const newArrivalDate = `모레(${month}/${day}, ${dayOfWeek} 오전 7시 전) 도착`;
    arrivalDateElement.textContent = newArrivalDate;

    // 책 소개 요약
    if (book.summary) {
      document.getElementById("book-summary").innerHTML =
        "<strong>" + book.summary.replace(/\n/g, "<br>") + "</strong>";
    }

    // 본문 설명
    document.getElementById("book-description").innerHTML =
      book.description.replace(/\n/g, "<br>");

    // 목차
    const contentsList = document.getElementById("book-contents");
    book.contents.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      contentsList.appendChild(li);
    });

    // 출판사 서평 혹은 책 속으로
    document.getElementById("review-title").textContent = book.review_title;
    document.getElementById("review-detail").innerHTML =
      book.review_detail.replace(/\n/g, "<br>");

    // 기본 정보
    document.getElementById("isbn").textContent = book.isbn;
    document.getElementById("publish-date").textContent = book.publish_date;
    document.getElementById("page-count").textContent = book.page_count;
    document.getElementById("size").textContent = book.size;
    document.getElementById("total-volume").textContent = book.total_volume;

    // 하단 구매 금액
    document.getElementById("bottom-price").textContent =
      book.sale_price.toLocaleString() + "원";
    
    // 주간베스트 정보 표시
    if (book.weekly) {
        document.getElementById("weekly-box").style.display = "block";

        document.getElementById("rank-total").textContent = book.weekly.rank_total;
        document.getElementById("rank-category").textContent = book.weekly.rank_category;

        document.getElementById("weekly-score").textContent = Number(book.weekly.score).toFixed(1);

        // 클로버 5개 출력
        let cloverHTML = "";
        for (let i = 0; i < 5; i++) {
            cloverHTML += `<img src="images/1_클로버.png" class="clover-icon">`;

        }
        document.getElementById("weekly-clovers").innerHTML = cloverHTML;

        document.getElementById("weekly-review-count").textContent =
            `(${book.weekly.review_count}개의 리뷰)`;

        document.getElementById("weekly-comment").innerHTML =
            book.weekly.comment.replace(/\n/g, "<br>");
        document.getElementById("weekly-buyer-percent").textContent =
            `(${book.weekly.buyer_percent}%의 구매자)`;
    }

    // 수량 & 총액 업데이트 기능
    let quantity = 1;
    const quantityElement = document.getElementById("quantity");
    const bottomPriceElement = document.getElementById("bottom-price");

    document.getElementById("increase").addEventListener("click", () => {
        quantity++;
        updateTotal();
    });

    document.getElementById("decrease").addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            updateTotal();
        }
    });

    function updateTotal() {
        quantityElement.textContent = quantity;
        bottomPriceElement.textContent = (book.sale_price * quantity).toLocaleString() + "원";
    }

    // 장바구니 버튼 클릭 이벤트
    const cartButton = document.getElementById("cart-button");
    const cartModal = document.getElementById("cart-modal");
    const modalCancel = document.getElementById("modal-cancel");
    const modalConfirm = document.getElementById("modal-confirm");

    cartButton.addEventListener("click", () => {
        // 장바구니에 상품 추가 (localStorage 사용)
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        const cartItem = {
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover,
            price: book.sale_price,
            quantity: quantity,
            selected: true  
        };

        // 이미 장바구니에 있는 상품인지 확인
        const existingIndex = cart.findIndex(item => item.id === book.id);
        if (existingIndex !== -1) {
            // 이미 있으면 수량 증가
            cart[existingIndex].quantity += quantity;
        } else {
            // 없으면 새로 추가
            cart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        
        // 모달 표시
        cartModal.classList.add("show");
    });

    // 취소 버튼 클릭
    modalCancel.addEventListener("click", () => {
        cartModal.classList.remove("show");
    });

    // 장바구니 보기 버튼 클릭
    modalConfirm.addEventListener("click", () => {
        window.location.href = "1_북마크_cart.html";
    });

    // 모달 배경 클릭 시 닫기
    cartModal.addEventListener("click", (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove("show");
        }
    });

  });
