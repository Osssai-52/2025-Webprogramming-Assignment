//회원가입 함수
function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const address = document.getElementById('address').value;

    //입력 정보 유효성 검사
    if (!username || !password || !name || !gender || !address) {
        alert('모든 양식을 채워주세요.');
        return;
    }
    if (!document.getElementById("agree").checked) {
    alert("개인정보 수집에 동의해야 합니다.");
    return;
}
    //사용자 목록 가져오기
    const users = JSON.parse(localStorage.getItem('users')) || [];
    //새로운 사용자 추가
    const newUser = {
        id: users.length + 1,
        username: username,
        password: password,
        name: name,
        gender: gender,
        address: address
    };
    users.push(newUser);
    //로컬 스토리지에 저장
    localStorage.setItem('users', JSON.stringify(users));
    alert('회원가입이 완료되었습니다!');
    document.getElementById('signupForm').reset(); //폼 초기화

    // 회원가입 후 main 페이지로 이동
    window.location.href = "1_북마크_main.html";
}

//회원 목록 표시 함수
function displayUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userList = document.getElementById('userList');
    //기존 목룍 초기화
    userList.innerHTML = '';
    if (users.length === 0) {
        userList.innerHTML = '<li>저장된 사용자가 없습니다.</li>';
        return;
    }
    //사용자 목록 출력
    for (user of users) {
        const li = document.createElement('li');
        li.textContent = `ID: ${user.id}, 아이디: ${user.username}, 이름: ${user.name}, 성별: ${user.gender}, 주소: ${user.address}`;
        userList.appendChild(li);
    };
}

// 체크하면 활성화, 아니면 비활성화
function toggleSignupButton() {
    const agree = document.getElementById("agree").checked;
    const btn = document.getElementById("signupBtn");

    btn.disabled = !agree;
}

