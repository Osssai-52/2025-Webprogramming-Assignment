const CART_STORAGE_KEY = 'kyobo_cart';
const DELIVERY_FEE = 2500;
const FREE_DELIVERY_THRESHOLD = 50000; 

// 웹 스토리지에서 장바구니 데이터 로드 또는 초기 데이터 설정
function getCartItems() {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return [];
    
    const cartData = JSON.parse(savedCart);
    
    return cartData.map(item => ({
        id: item.id,
        name: item.title,
        image: item.cover,
        price: item.price,
        quantity: item.quantity,
        selected: item.selected !== undefined ? item.selected : true 
    }));
}

// 장바구니 데이터 저장 (변경 사항이 있을 때마다 호출)
function saveCartItems(items) {
    const cartData = items.map(item => ({
        id: item.id,
        title: item.name,
        author: item.author || '', 
        cover: item.image,
        price: item.price,
        quantity: item.quantity,
        selected: item.selected
    }));
    localStorage.setItem('cart', JSON.stringify(cartData));
}

// 상품 목록 렌더링 및 이벤트 바인딩
function renderCart() {
    const cartItems = getCartItems();
    const tbody = document.querySelector('.cart-table tbody');
    tbody.innerHTML = ''; 

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

// 결제 요약 정보 
function updateSummary() {
    const cartItems = getCartItems();
    const selectedItems = cartItems.filter(item => item.selected);
    const totalProductAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let shippingFee = DELIVERY_FEE;
    if (totalProductAmount === 0) {
        shippingFee = 0;
    } 
    else if (totalProductAmount >= FREE_DELIVERY_THRESHOLD) {
        shippingFee = 0;
    }

    const totalPaymentAmount = totalProductAmount + shippingFee;
    const totalPoints = Math.floor(totalPaymentAmount * 0.01); 

    document.querySelector('.cart-summary-box p:nth-child(2) span').textContent = `₩${totalProductAmount.toLocaleString()}`; // 상품 금액
    document.querySelector('.cart-summary-box p:nth-child(3) span').textContent = `₩${shippingFee.toLocaleString()}`; // 배송비
    document.querySelector('.cart-summary-box p:nth-child(5) span').textContent = `₩${totalPaymentAmount.toLocaleString()}`; // 결제 예정 금액
    document.querySelector('.cart-summary-box p:nth-child(6) span').textContent = `${totalPoints.toLocaleString()}P`; // 적립 예정 포인트
}

// 전체 선택 체크박스 상태 업데이트
function updateSelectAllCheckbox() {
    const cartItems = getCartItems();
    const allCheckbox = document.getElementById('select-all-items');
    
    if (allCheckbox) {
        const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
        allCheckbox.checked = allSelected;
    }
}


// 이벤트 핸들러 바인딩 
function bindEvents() {
    const cartItems = getCartItems();

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
            renderCart(); 
        };
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            showCustomConfirm('해당 상품을 장바구니에서 삭제하시겠습니까?', function() {
                 const newCart = cartItems.filter(item => item.id !== id);
                saveCartItems(newCart);
                renderCart();
            });
        };
    });

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

    const selectAllCheckbox = document.getElementById('select-all-items');
    if (selectAllCheckbox) {
        selectAllCheckbox.onchange = (e) => {
            const isChecked = e.target.checked;
            cartItems.forEach(item => item.selected = isChecked);
            saveCartItems(cartItems);
            renderCart(); 
        };
    }
    
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
    modalCancelBtn.style.display = 'none'; 
    modal.classList.add('active');
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
    modalCancelBtn.style.display = 'inline-block'; 
    modal.classList.add('active');
    modalOkBtn.onclick = () => {
        modal.classList.remove('active');
        if (onConfirm) onConfirm();
    };
    modalCancelBtn.onclick = () => {
        modal.classList.remove('active');
    };
}

// 추천 도서 장바구니 담기 기능
function addRecommendedBookToCart() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            const title = e.target.dataset.title;
            const price = parseInt(e.target.dataset.price);
            const image = e.target.dataset.image;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingIndex = cart.findIndex(item => item.id === id);
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
                showCustomAlert('장바구니에 상품 수량이 추가되었습니다.');
            } else {
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
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        };
    });
}

// 초기 로딩 시 장바구니 목록 렌더링 시작
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    addRecommendedBookToCart();
});