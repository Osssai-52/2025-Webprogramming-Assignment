document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 사이드바
    const menuOpenBtn = document.getElementById('menu-open-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const sidebar = document.querySelector('.mega-menu-sidebar');
    const overlay = document.querySelector('.menu-overlay');

    if (menuOpenBtn && sidebar && overlay) {
        function openMenu() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        }
        function closeMenu() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }

        menuOpenBtn.addEventListener('click', openMenu);
        if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
    }

    // 2. 실시간 검색창
    const searchInput = document.querySelector('.search-form input');
    const searchDropdown = document.querySelector('.search-results-dropdown');
    const searchWrapper = document.querySelector('.search-wrapper');

    if (searchInput && searchDropdown && searchWrapper) {
        // 검색창 열기
        searchInput.addEventListener('focus', () => {
            searchDropdown.style.display = 'block';
        });

        // 검색창 닫기
        document.addEventListener('click', (e) => {
            if (!searchWrapper.contains(e.target)) {
                searchDropdown.style.display = 'none';
            }
        });
    }

    // 3. 공통 푸터 로드
    const footerPlaceholder = document.getElementById('common-footer');

    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <footer>
                <div class="footer-inner">
                    <div class="footer-links">
                        <a href="#">회사소개</a>
                        <a href="#">이용약관</a>
                        <a href="#">**개인정보처리방침**</a>
                        <a href="#">고객센터</a>
                    </div>
                    <div class="copyright">
                        <p>(주)북마크 | 대표이사: OOO | 사업자등록번호: 123-45-67890</p>
                        <p>ⓒ BOOKMARK. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    }
});