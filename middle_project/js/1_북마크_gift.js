function updateGiftSummary() {
    const giftRows = document.querySelectorAll('.cart-table tbody tr');
    let selectedCount = 0;
    let totalAmount = 0;

    giftRows.forEach(row => {
        const selectedOption = row.querySelector('input[type="radio"]:checked');
        if (selectedOption && selectedOption.value === "선택") {
            selectedCount++;
            const priceText = row.querySelector('td:nth-child(2)').textContent.trim();
            const price = parseInt(priceText.replace(/[^0-9]/g, '')); // ₩ 제거 후 숫자 변환
            totalAmount += price;
        }
    });

    const summaryBox = document.querySelector('.cart-summary-box');
    if (!summaryBox) return;

    summaryBox.querySelector('p[data-label="사은품 개수:"] span').textContent = `${selectedCount}개`;
    summaryBox.querySelector('p[data-label="선택 사은품 총액:"] span').textContent = `₩${totalAmount.toLocaleString()}`;
    summaryBox.querySelector('p.total-amount span').textContent = `₩${totalAmount.toLocaleString()}`;
}

// 라디오 버튼 이벤트 바인딩
document.querySelectorAll('.cart-table input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', updateGiftSummary);
});

// 페이지 로드 시 초기 업데이트
document.addEventListener('DOMContentLoaded', updateGiftSummary);
