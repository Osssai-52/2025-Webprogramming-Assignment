// 1. 책 데이터
const bestsellers = [
    { 
        title: "불편한 편의점", 
        img: "images/1_불편한 편의점.jpg", 
        desc: "지친 하루 끝에, 따뜻한 위로와 웃음이 기다리는 곳.", 
        link: "1_북마크_detail_불편한편의점.html" 
    },
    { 
        title: "세이노의 가르침", 
        img: "images/1_세이노의 가르침.jpg", 
        desc: "피보다 진하게 살아라, 삶의 지혜를 담은 멘토링.", 
        link: "#" 
    },
    { 
        title: "역행자", 
        img: "images/1_역행자.jpg", 
        desc: "자유와 경제적 자유를 위한 가장 확실한 공략집.", 
        link: "#" 
    },
    { 
        title: "도둑맞은 집중력", 
        img: "images/1_도둑맞은 집중력.jpg", 
        desc: "집중력 위기의 시대, 다시 몰입하기 위한 가장 강력한 통찰.", 
        link: "#" 
    },
    { 
        title: "나는 메트로폴리탄 미술관의 경비원입니다", 
        img: "images/1_나는 메트로폴리탄.jpg", 
        desc: "세상에서 가장 아름다운 곳에서 가장 낮은 시선으로 발견한 삶의 의미.", 
        link: "#" 
    },
    { 
        title: "원씽(The One Thing)", 
        img: "images/1_원씽.jpg", 
        desc: "복잡한 세상을 이기는 단순함의 힘, 당신의 '원씽'은 무엇인가?", 
        link: "#" 
    },
    { 
        title: "데일 카네기 인간관계론", 
        img: "images/1_데일 카네기 인간관계론.jpg", 
        desc: "인간관계의 기술을 배우고, 더 나은 삶을 위한 지혜를 얻다", 
        link: "#" 
    }
];

const mdPicks = [
    { 
        title: "어린왕자 (초판본)", 
        img: "images/1_어린왕자.jpg", 
        desc: "세대를 넘어 사랑받는, 어른들을 위한 가장 아름다운 동화.", 
        link: "1_북마크_detail_어린왕자.html" 
    },
    { 
        title: "파친코", 
        img: "images/1_파친코.jpg", 
        desc: "4대에 걸친 재일조선인 가족의 처절하고도 감동적인 대서사시.", 
        link: "#" 
    },
    { 
        title: "도파민네이션", 
        img: "images/1_도파민네이션.jpg", 
        desc: "쾌락 과잉 시대, 우리를 중독시키는 도파민의 비밀을 파헤치다.", 
        link: "#" 
    },
    { 
        title: "지구 끝의 온실", 
        img: "images/1_지구 끝의 온실.jpg", 
        desc: "멸망 이후의 세상, 푸른빛 희망을 찾아 떠나는 두 사람의 여정.", 
        link: "#" 
    },
    { 
        title: "사피엔스", 
        img: "images/1_사피엔스.jpg", 
        desc: "인류의 과거, 현재, 미래를 관통하는 거대하고도 대담한 질문.", 
        link: "#" 
    },
    { 
        title: "어떻게 살 것인가", 
        img: "images/1_어떻게 살 것인가.jpg", 
        desc: "인생의 의미와 목적에 대한 유시민 작가의 깊이 있는 탐구.", 
        link: "#" 
    },
    { 
        title: "클루지", 
        img: "images/1_클루지.jpg", 
        desc: "복잡한 세상을 살아가는 우리에게 필요한 지혜와 통찰.", 
        link: "#" 
    },
    { 
        title: "1984", 
        img: "images/1_1984.jpg", 
        desc: "전체주의와 감시 사회에 대한 경고, 자유의 소중함을 일깨우다.", 
        link: "#" 
    }
];

// 2. 책 렌더링 함수
function renderBooks(containerId, bookList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    bookList.forEach(book => {
        html += `
            <a href="${book.link}" class="book-card-link">
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
    renderBooks('bestseller-list', bestsellers);
    renderBooks('md-pick-list', mdPicks);
    initCarousel();
});