const CART_STORAGE_KEY = 'kyobo_cart';
const DELIVERY_FEE = 2500;
const FREE_DELIVERY_THRESHOLD = 50000; // 배송비 무료 기준 금액 (5만원)

// 1. 웹 스토리지에서 장바구니 데이터 로드 또는 초기 데이터 설정
function getCartItems() {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
        return JSON.parse(savedCart);
    }
    // 초기 기본 데이터 설정 (요청사항 반영)
    const initialCart = [
        { id: 1, name: "불편한 편의점", price: 16800, quantity: 1, image: "images/1_불편한 편의점.jpg", selected: true },
        { id: 2, name: "세이노의 가르침", price: 7200, quantity: 2, image: "images/1_세이노의 가르침.jpg", selected: true }
    ];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(initialCart));
    return initialCart;
}

// 2. 장바구니 데이터 저장 (변경 사항이 있을 때마다 호출)
function saveCartItems(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
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

    document.querySelector('.cart-summary-box p:nth-child(2) span').textContent = `₩${totalProductAmount.toLocaleString()}`;
    document.querySelector('.cart-summary-box p:nth-child(3) span').textContent = `₩${shippingFee.toLocaleString()}`;
    document.querySelector('.cart-summary-box p:nth-child(5) span').textContent = `₩${totalPaymentAmount.toLocaleString()}`;
    document.querySelector('.cart-summary-box p:nth-child(6) span').textContent = `₩${totalPoints.toLocaleString()}`;
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
            const newCart = cartItems.filter(item => item.id !== id);
            saveCartItems(newCart);
            renderCart();
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
            showCustomAlert("장바구니가 이미 비어있습니다.");
            return;
        }

        showCustomConfirm('장바구니의 모든 상품을 삭제하시겠습니까?', function() {
            saveCartItems([]);
            renderCart();
        });
    };
}


// 페이지 로드 시 장바구니 렌더링 시작
document.addEventListener('DOMContentLoaded', renderCart);

// cart.js 파일 내 bindEvents() 함수 내부에 추가

document.querySelectorAll('.book-card button').forEach(button => {
    button.onclick = (e) => {
        const card = e.target.closest('.book-card');
        const itemName = card.querySelector('h3').textContent.trim();
        // 실제 상품 ID, 가격, 이미지 경로는 서버/데이터 구조에 맞게 가져와야 합니다.
        // 여기서는 임시 값과 상품 이름만 사용합니다.
        
        const cartItems = getCartItems();

        // 1. 이미 장바구니에 있는지 확인
        const existingItem = cartItems.find(item => item.name === itemName);

        if (existingItem) {
            // 2. 이미 있다면 수량만 증가
            existingItem.quantity += 1;
        } else {
            // 3. 없다면 새 항목 추가
            const newItem = {
                // ID는 현재 장바구니의 최대 ID보다 1 크게 설정 (고유 ID 생성)
                id: cartItems.length > 0 ? Math.max(...cartItems.map(i => i.id)) + 1 : 1,
                name: itemName,
                price: 18000, // 예시 가격 (실제 데이터에 따라 변경)
                quantity: 1,
                image: card.querySelector('img').getAttribute('src'),
                selected: true
            };
            cartItems.push(newItem);
        }

        saveCartItems(cartItems);
        renderCart();
        showCustomAlert(`${itemName}이 장바구니에 추가되었습니다.`);
    };
});
