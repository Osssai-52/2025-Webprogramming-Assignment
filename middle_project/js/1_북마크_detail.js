const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

fetch("js/1_북마크_detail.json")
  .then(res => res.json())
  .then(data => {
    const book = data[bookId];
    if (!book) return alert("책 정보를 찾을 수 없습니다.");

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

    // 포인트, 배송
    document.getElementById("point").textContent = book.point + "P";
    document.getElementById("arrival-date").textContent = book.arrival_date;

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

  });
