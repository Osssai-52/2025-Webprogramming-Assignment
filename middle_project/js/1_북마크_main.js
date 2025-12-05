
// 1. 클릭 기록 함수
window.handleBookClick = function(id) {
    if (!id) return;
    const counts = JSON.parse(localStorage.getItem('bookClicks')) || {};
    counts[id] = (counts[id] || 0) + 1;
    localStorage.setItem('bookClicks', JSON.stringify(counts));
}

// 2. 책 렌더링 함수
function renderBooks(containerId, bookList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    bookList.forEach(book => {
        html += `
            <a href="1_북마크_detail.html?id=${book.id}" class="book-card-link" onclick="handleBookClick(${book.id})">
                <article class="book-card">
                    <img class="book-cover" src="${book.img}" alt="${book.title}">
                    <h3 class="book-title">${book.title}</h3>
                    <div class="book-details">
                        <p class="book-description">${book.desc}</p>
                        <button type="button" class="cart-button">자세히 보기</button>
                    </div>
                </article>
            </a>
        `;
    });
    container.innerHTML = html;
}

// 3. 캐러셀 화살표
function initCarousel() {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(container => {
        const list = container.querySelector('.book-carousel');
        const prevBtn = container.querySelector('.arrow.prev');
        const nextBtn = container.querySelector('.arrow.next');

        if (!list || !prevBtn || !nextBtn) return;

        nextBtn.addEventListener('click', () => {
            list.scrollBy({ left: list.clientWidth, behavior: 'smooth' });
            setTimeout(() => updateButtonState(list, prevBtn, nextBtn), 500);
        });

        prevBtn.addEventListener('click', () => {
            list.scrollBy({ left: -list.clientWidth, behavior: 'smooth' });
            setTimeout(() => updateButtonState(list, prevBtn, nextBtn), 500);
        });

        // 초기 버튼 상태
        setTimeout(() => updateButtonState(list, prevBtn, nextBtn), 100);
    });
}

function updateButtonState(list, prevBtn, nextBtn) {
    if (list.scrollLeft <= 10) prevBtn.classList.add('disabled');
    else prevBtn.classList.remove('disabled');
    
    if (list.scrollLeft + list.clientWidth >= list.scrollWidth - 10) nextBtn.classList.add('disabled');
    else nextBtn.classList.remove('disabled');
}

// 실행
document.addEventListener('DOMContentLoaded', () => {
    if (window.bestsellersData) {
        renderBooks('bestseller-list', window.bestsellersData);
    }
    
    if (window.mdPicksData) {
        renderBooks('md-pick-list', window.mdPicksData);
    }
    
    initCarousel();
});