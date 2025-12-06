const CART_STORAGE_KEY = 'kyobo_cart';
const DELIVERY_FEE = 2500;
const FREE_DELIVERY_THRESHOLD = 50000; // 배송비 무료 기준 금액 (5만원)

// 1. 웹 스토리지에서 장바구니 데이터 로드 또는 초기 데이터 설정
function getCartItems() {
    // 상세 페이지에서 저장한 'cart' 키로 데이터 가져오기
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return [];
    
    const cartData = JSON.parse(savedCart);
    
    // 상세 페이지 형식을 장바구니 페이지 형식으로 변환
    return cartData.map(item => ({
        id: item.id,
        name: item.title,
        image: item.cover,
        price: item.price,
        quantity: item.quantity,
        selected: item.selected !== undefined ? item.selected : true // 기본값 true
    }));
}

// 2. 장바구니 데이터 저장 (변경 사항이 있을 때마다 호출)
function saveCartItems(items) {
    // 상세 페이지와 호환되는 형식으로 저장
    const cartData = items.map(item => ({
        id: item.id,
        title: item.name,
        author: item.author || '', // author 정보가 없으면 빈 문자열
        cover: item.image,
        price: item.price,
        quantity: item.quantity,
        selected: item.selected
    }));
    localStorage.setItem('cart', JSON.stringify(cartData));
}

// 3. 상품 목록 렌더링 및 이벤트 바인딩 (DOM 동적 생성)
function renderCart() {
    const cartItems = getCartItems();
    const tbody = document.querySelector('.cart-table tbody');
    tbody.innerHTML = ''; // 기존 목록 초기화

    if (cartItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-cart">장바구니에 상품이 없습니다.</td></tr>';
        updateSummary();
        return;
    }

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.dataset.id = item.id;
        row.innerHTML = `
            <td>
                <input type="checkbox" class="item-checkbox" data-id="${item.id}" ${item.selected ? 'checked' : ''}>
                <a href="gift.html"><div class="product-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="product-name">${item.name}</div>
                </div></a>
            </td>
            <td>₩${item.price.toLocaleString()}</td>
            <td>
                <div class="quantity-control">
                    <button class="quantity-minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1">
                    <button class="quantity-plus" data-id="${item.id}">+</button>
                </div>
            </td>
            <td class="item-total-price">₩${(item.price * item.quantity).toLocaleString()}</td>
            <td><span class="remove-btn" data-id="${item.id}">삭제</span></td>
        `;
        tbody.appendChild(row);
    });

    bindEvents();
    updateSummary();
    updateSelectAllCheckbox();
}

// 4. 결제 요약 정보 업데이트 (1. 도서 삭제/추가 시 금액 자동 반영 & 4. 배송비 자동 추가)
function updateSummary() {
    const cartItems = getCartItems();
    
    // 선택된 상품만 계산에 포함
    const selectedItems = cartItems.filter(item => item.selected);

    const totalProductAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 배송비 계산
    let shippingFee = DELIVERY_FEE;
    // 상품 금액이 0원이라면 배송비도 0원 (상품이 없으므로)
    if (totalProductAmount === 0) {
        shippingFee = 0;
    } 
    // 특정 금액 (5만원) 이상이면 배송비 무료
    else if (totalProductAmount >= FREE_DELIVERY_THRESHOLD) {
        shippingFee = 0;
    }

    const totalPaymentAmount = totalProductAmount + shippingFee;
    const totalPoints = Math.floor(totalPaymentAmount * 0.01); // 1% 적립 가정

    // 요약 박스 업데이트: [상품 금액], [배송비], [결제 예정 금액], [적립 예정 포인트]
    document.querySelector('.cart-summary-box p:nth-child(2) span').textContent = `₩${totalProductAmount.toLocaleString()}`; // 상품 금액
    document.querySelector('.cart-summary-box p:nth-child(3) span').textContent = `₩${shippingFee.toLocaleString()}`; // 배송비
    document.querySelector('.cart-summary-box p:nth-child(5) span').textContent = `₩${totalPaymentAmount.toLocaleString()}`; // 결제 예정 금액
    document.querySelector('.cart-summary-box p:nth-child(6) span').textContent = `${totalPoints.toLocaleString()}P`; // 적립 예정 포인트
}

// 5. 전체 선택 체크박스 상태 업데이트
function updateSelectAllCheckbox() {
    const cartItems = getCartItems();
    const allCheckbox = document.getElementById('select-all-items');
    
    if (allCheckbox) {
        // 장바구니에 상품이 있고, 모든 상품이 선택되었을 때만 true
        const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
        allCheckbox.checked = allSelected;
    }
}


// 6. 이벤트 핸들러 바인딩 (1, 2, 3 기능 구현)
function bindEvents() {
    const cartItems = getCartItems();

    // 2. 선택 수량 조절 기능 및 자동 반영
    document.querySelectorAll('.quantity-control button').forEach(button => {
        button.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            const item = cartItems.find(i => i.id === id);
            if (!item) return;

            if (e.target.classList.contains('quantity-plus')) {
                item.quantity++;
            } else if (e.target.classList.contains('quantity-minus')) {
                if (item.quantity > 1) {
                    item.quantity--;
                }
            }
            saveCartItems(cartItems);
            renderCart(); // 목록 및 요약 정보 재렌더링
        };
    });

    // 1. 상품 삭제 기능
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            // 모달을 사용하여 사용자에게 삭제 여부를 확인
            showCustomConfirm('해당 상품을 장바구니에서 삭제하시겠습니까?', function() {
                 const newCart = cartItems.filter(item => item.id !== id);
                saveCartItems(newCart);
                renderCart();
            });
        };
    });

    // 개별 체크박스 이벤트 (선택 기능)
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.onchange = (e) => {
            const id = parseInt(e.target.dataset.id);
            const item = cartItems.find(i => i.id === id);
            if (item) {
                item.selected = e.target.checked;
                saveCartItems(cartItems);
                updateSummary();
                updateSelectAllCheckbox();
            }
        };
    });

    // 3. 전체 선택 버튼 이벤트
    const selectAllCheckbox = document.getElementById('select-all-items');
    if (selectAllCheckbox) {
        selectAllCheckbox.onchange = (e) => {
            const isChecked = e.target.checked;
            cartItems.forEach(item => item.selected = isChecked);
            saveCartItems(cartItems);
            renderCart(); // 목록 전체 업데이트
        };
    }
    
    // 3. 선택 삭제 버튼 이벤트
    document.getElementById('delete-selected-btn').onclick = () => {
        const newCart = cartItems.filter(item => !item.selected);
        if (newCart.length === cartItems.length) {
            showCustomAlert("선택된 상품이 없습니다.");
            return;
        }

        showCustomConfirm('선택된 상품을 삭제하시겠습니까?', function() {
            saveCartItems(newCart);
            renderCart();
        });
    };
    
    // 3. 전체 삭제 버튼 이벤트
    document.getElementById('delete-all-btn').onclick = () => {
        if (cartItems.length === 0) {
            showCustomAlert("장바구니에 삭제할 상품이 없습니다.");
            return;
        }
        
        showCustomConfirm('장바구니의 모든 상품을 삭제하시겠습니까?', function() {
            saveCartItems([]);
            renderCart();
        });
    };
}


// --- 모달 (Custom Alert/Confirm) 로직 ---

const modal = document.getElementById('custom-modal');
const modalMessage = document.getElementById('modal-message');
const modalOkBtn = document.getElementById('modal-ok-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

/**
 * Custom Alert 모달 표시
 * @param {string} message - 표시할 메시지
 */
function showCustomAlert(message) {
    modalMessage.textContent = message;
    modalCancelBtn.style.display = 'none'; // 취소 버튼 숨김
    modal.classList.add('active');

    // 확인 버튼 클릭 시 모달 닫기
    modalOkBtn.onclick = () => {
        modal.classList.remove('active');
    };
}

/**
 * Custom Confirm 모달 표시
 * @param {string} message - 표시할 메시지
 * @param {function} onConfirm - '확인' 클릭 시 실행할 콜백 함수
 */
function showCustomConfirm(message, onConfirm) {
    modalMessage.textContent = message;
    modalCancelBtn.style.display = 'inline-block'; // 취소 버튼 표시
    modal.classList.add('active');

    // '확인' 버튼 클릭 시
    modalOkBtn.onclick = () => {
        modal.classList.remove('active');
        if (onConfirm) onConfirm();
    };

    // '취소' 버튼 클릭 시
    modalCancelBtn.onclick = () => {
        modal.classList.remove('active');
    };
}

// 추천 도서 장바구니 담기 기능
function addRecommendedBookToCart() {
    // 모든 추천 도서의 "장바구니 담기" 버튼에 이벤트 추가
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            const title = e.target.dataset.title;
            const price = parseInt(e.target.dataset.price);
            const image = e.target.dataset.image;

            // 현재 장바구니 데이터 가져오기
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // 이미 장바구니에 있는 상품인지 확인
            const existingIndex = cart.findIndex(item => item.id === id);
            
            if (existingIndex !== -1) {
                // 이미 있으면 수량 증가
                cart[existingIndex].quantity += 1;
                showCustomAlert('장바구니에 상품 수량이 추가되었습니다.');
            } else {
                // 없으면 새로 추가
                const newItem = {
                    id: id,
                    title: title,
                    author: '',
                    cover: image,
                    price: price,
                    quantity: 1,
                    selected: true
                };
                cart.push(newItem);
                showCustomAlert('장바구니에 상품이 추가되었습니다.');
            }

            // localStorage에 저장
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // 장바구니 목록 다시 렌더링
            renderCart();
        };
    });
}

// 초기 로딩 시 장바구니 목록 렌더링 시작
document.addEventListener('DOMContentLoaded', () => {
    // 렌더링 전에 초기 로컬 스토리지를 확인하여 데이터가 없으면 '장바구니에 상품이 없습니다' 상태가 되도록 합니다.
    renderCart();
    // 추천 도서 장바구니 담기 버튼 이벤트 바인딩
    addRecommendedBookToCart();
});