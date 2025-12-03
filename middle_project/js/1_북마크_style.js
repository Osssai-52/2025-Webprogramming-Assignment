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
    const rankingContainer = document.querySelector('.popular-products ul');

    function performSearch(keyword) {
        if (!keyword) return;
        saveKeyword(keyword);
        loadRecentSearches();
        showCustomAlert(`'${keyword}'에 대한 검색 결과가 없습니다.`);
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

    // (4) 실시간 인기 도서
    function renderRealTimeRanking() {
        const allBooks = window.allBookList || [];
        const counts = JSON.parse(localStorage.getItem('bookClicks')) || {};

        if (!rankingContainer || allBooks.length === 0) return;

        const sortedBooks = [...allBooks].sort((a, b) => {
            const countA = counts[a.id] || 0;
            const countB = counts[b.id] || 0;
            return countB - countA; 
        });

        const top3 = sortedBooks.slice(0, 3);

        let html = '';
        top3.forEach((book, index) => {
            const rankColor = index === 0 ? 'color:#00af31;' : 'color:#333;';
            
            html += `
                <li>
                    <a href="${book.link}" style="display:flex; align-items:center; gap:10px;">
                        <span style="font-weight:900; font-size:16px; ${rankColor} width:20px;">${index + 1}</span>
                        <img src="${book.img}" alt="${book.title}" style="width:40px; height:55px; object-fit:cover; border-radius:4px;">
                        <span style="font-size:14px; font-weight:500;">${book.title}</span>
                    </a>
                </li>
            `;
        });

        rankingContainer.innerHTML = html;
    }

    if (searchInput && searchDropdown && searchWrapper) {
        searchInput.addEventListener('focus', () => {
            renderRealTimeRanking();
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

    // 4. 책 데이터
    const bestsellers = [
        {
            id: 1,
            title: "불편한 편의점", 
            img: "images/1_불편한 편의점.jpg", 
            desc: "지친 하루 끝에, 따뜻한 위로와 웃음이 기다리는 곳.", 
            link: "1_북마크_detail.html?id=1" 
        },
        { 
            id: 2,
            title: "세이노의 가르침", 
            img: "images/1_세이노의 가르침.jpg", 
            desc: "피보다 진하게 살아라, 삶의 지혜를 담은 멘토링.", 
            link: "#" 
        },
        { 
            id: 3,
            title: "역행자", 
            img: "images/1_역행자.jpg", 
            desc: "자유와 경제적 자유를 위한 가장 확실한 공략집.", 
            link: "#" 
        },
        { 
            id: 4,
            title: "도둑맞은 집중력", 
            img: "images/1_도둑맞은 집중력.jpg", 
            desc: "집중력 위기의 시대, 다시 몰입하기 위한 가장 강력한 통찰.", 
            link: "#" 
        },
        { 
            id: 5,
            title: "나는 메트로폴리탄 미술관의 경비원입니다", 
            img: "images/1_나는 메트로폴리탄.jpg", 
            desc: "세상에서 가장 아름다운 곳에서 가장 낮은 시선으로 발견한 삶의 의미.", 
            link: "#" 
        },
        { 
            id: 6,
            title: "원씽(The One Thing)", 
            img: "images/1_원씽.jpg", 
            desc: "복잡한 세상을 이기는 단순함의 힘, 당신의 '원씽'은 무엇인가?", 
            link: "#" 
        },
        { 
            id: 7,
            title: "데일 카네기 인간관계론", 
            img: "images/1_데일 카네기 인간관계론.jpg", 
            desc: "인간관계의 기술을 배우고, 더 나은 삶을 위한 지혜를 얻다", 
            link: "#" 
        },
        { 
            id: 8,
            title: "사피엔스", 
            img: "images/1_사피엔스.jpg", 
            desc: "인류의 과거, 현재, 미래를 관통하는 거대하고도 대담한 질문.", 
            link: "#" 
        },
        { 
            id: 9,
            title: "어떻게 살 것인가", 
            img: "images/1_어떻게 살 것인가.jpg", 
            desc: "인생의 의미와 목적에 대한 유시민 작가의 깊이 있는 탐구.", 
            link: "#" 
        },
    ];

    const mdPicks = [
        {
            id: 10,
            title: "어린왕자 (초판본)", 
            img: "images/1_어린왕자.jpg", 
            desc: "세대를 넘어 사랑받는, 어른들을 위한 가장 아름다운 동화.", 
            link: "1_북마크_detail.html?id=10" 
        },
        { 
            id: 11,
            title: "파친코", 
            img: "images/1_파친코.jpg", 
            desc: "4대에 걸친 재일조선인 가족의 처절하고도 감동적인 대서사시.", 
            link: "#" 
        },
        {
            id: 12,
            title: "혼모노", 
            img: "images/1_혼모노.jpg", 
            desc: "진짜 일본을 찾아 떠나는 감성 여행기.", 
            link: "#"
        },
        {
            id: 13,
            title: "절창",
            img: "images/1_절창.jpg",
            desc: "일본 최고의 셰프가 전하는 요리와 인생 이야기.",
            link: "#"
        },
        { 
            id: 14,
            title: "지구 끝의 온실", 
            img: "images/1_지구 끝의 온실.jpg", 
            desc: "멸망 이후의 세상, 푸른빛 희망을 찾아 떠나는 두 사람의 여정.", 
            link: "#" 
        },
        { 
            id: 15,
            title: "도파민네이션", 
            img: "images/1_도파민네이션.jpg", 
            desc: "쾌락 과잉 시대, 우리를 중독시키는 도파민의 비밀을 파헤치다.", 
            link: "#" 
        },
        { 
            id: 16,
            title: "클루지", 
            img: "images/1_클루지.jpg", 
            desc: "복잡한 세상을 살아가는 우리에게 필요한 지혜와 통찰.", 
            link: "#" 
        },
        { 
            id: 17,
            title: "1984", 
            img: "images/1_1984.jpg", 
            desc: "전체주의와 감시 사회에 대한 경고, 자유의 소중함을 일깨우다.", 
            link: "#" 
        }
    ];

    // 모든 책 데이터를 전역으로 노출
    window.allBookList = [...bestsellers, ...mdPicks];
    window.bestsellersData = bestsellers;
    window.mdPicksData = mdPicks;

    // 5. 커스텀 알림창/확인창
    const modal = document.getElementById('custom-modal');
    const modalMsg = document.getElementById('modal-message');
    const okBtn = document.getElementById('modal-ok-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    // (1) 알림창 (확인 버튼)
    window.showCustomAlert = function(msg) {
        if (!modal) return alert(msg);
        modalMsg.textContent = msg;
        cancelBtn.style.display = 'none';
        modal.classList.add('show');
        okBtn.onclick = () => {
            modal.classList.remove('show');
        };
    };

    // (2) 확인창 (확인/취소 버튼)
    window.showCustomConfirm = function(msg, callback) {
        if (!modal) {
            if(confirm(msg)) callback();
            return;
        }

        modalMsg.textContent = msg;
        cancelBtn.style.display = 'inline-block';
        modal.classList.add('show');
        okBtn.onclick = () => {
            modal.classList.remove('show');
            if (callback) callback();
        };

        cancelBtn.onclick = () => {
            modal.classList.remove('show');
        };
    };

    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('custom-modal');
        const cancelBtn = document.getElementById('modal-cancel-btn');
        const okBtn = document.getElementById('modal-ok-btn');

    // 창이 열려 있을 때만 작동
        if (modal && modal.classList.contains('show')) {
            
            // Enter 키를 눌렀을 때 동작
            if (e.key === 'Enter') {
                e.preventDefault();

                // (1) 확인창- 안전을 위해 취소버튼이 눌림
                if (cancelBtn && cancelBtn.style.display !== 'none') {
                    cancelBtn.click(); 
                } 
                // (2) 알림창 - 확인버튼이 눌림
                else {
                    okBtn.click();
                }
            }
            
            // Escape 키를 눌렀을 때 동작
            if (e.key === 'Escape') {
                if (cancelBtn && cancelBtn.style.display !== 'none') cancelBtn.click();
                else okBtn.click();
            }
        }
    });
});