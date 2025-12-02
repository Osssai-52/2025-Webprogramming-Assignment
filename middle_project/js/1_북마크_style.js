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

    // 2. 검색창
    const searchInput = document.querySelector('.search-form input');
    const searchForm = document.querySelector('.search-form');
    const recentSearchList = document.querySelector('.recent-searches'); 
    const searchDropdown = document.querySelector('.search-results-dropdown');
    const searchWrapper = document.querySelector('.search-wrapper');
    const recommendedKeywords = document.querySelectorAll('.recommended-keywords .keywords-list a');

    function performSearch(keyword) {
        if (!keyword) return;
        saveKeyword(keyword);
        loadRecentSearches();
        alert(`'${keyword}'에 대한 검색 결과가 없습니다.`);
        if (searchInput) searchInput.value = '';
    }

    function saveKeyword(keyword) {
        let keywords = JSON.parse(localStorage.getItem('recentKeywords')) || [];
        keywords = keywords.filter(k => k !== keyword);
        keywords.unshift(keyword);
        if (keywords.length > 10) keywords.pop();
        localStorage.setItem('recentKeywords', JSON.stringify(keywords));
    }

    function deleteKeyword(keyword) {
        let keywords = JSON.parse(localStorage.getItem('recentKeywords')) || [];
        keywords = keywords.filter(k => k !== keyword);
        localStorage.setItem('recentKeywords', JSON.stringify(keywords));
        loadRecentSearches();
    }

    function loadRecentSearches() {
        const keywords = JSON.parse(localStorage.getItem('recentKeywords')) || [];
        
        if (keywords.length > 0) {
            recentSearchList.innerHTML = '<h4>최근 검색어</h4><ul class="recent-list"></ul>';
            const listContainer = recentSearchList.querySelector('.recent-list');
            keywords.forEach(keyword => {
                const li = document.createElement('li');
                li.className = 'recent-item';
                const textSpan = document.createElement('span');
                textSpan.textContent = keyword;
                textSpan.onclick = () => performSearch(keyword);
                const delBtn = document.createElement('button');
                delBtn.className = 'delete-btn';
                delBtn.textContent = '×';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteKeyword(keyword);};
                li.appendChild(textSpan);
                li.appendChild(delBtn);
                listContainer.appendChild(li);
            });
        } else {
            recentSearchList.innerHTML = `
                <h4>최근 검색어</h4>
                <div class="no-recent"><p>!</p>최근 검색어가 없습니다.</div>
            `;
        }
    }

    // (1) 검색창 엔터/클릭
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(searchInput.value.trim());
        });
    }

    // (2) 추천 검색어 클릭
    recommendedKeywords.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch(this.textContent.trim());
        });
    });

    // (3) 드롭다운 열기/닫기
    if (searchInput && searchWrapper) {
        searchInput.addEventListener('focus', () => {
            loadRecentSearches();
            searchDropdown.style.display = 'block';
        });
        document.addEventListener('click', (e) => {
            if (!searchWrapper.contains(e.target)) {
                searchDropdown.style.display = 'none';
            }
        });
    }

    // 초기 로드
    loadRecentSearches();

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