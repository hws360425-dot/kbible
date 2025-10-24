// DOM 요소 선택
const modal = document.getElementById('full-screen-modal');
const closeBtn = document.getElementById('close-modal-btn');
const verseTitle = document.getElementById('verse-title');
const verseText = document.getElementById('verse-text');

// 가상의 성경 데이터베이스 (실제로는 API 호출 등으로 가져와야 함)
const bibleData = {
    '창세기 1:1': '태초에 하나님이 천지를 창조하시니라.',
    '요한복음 3:16': '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라.',
    // ... 더 많은 구절
};

/**
 * 전체 화면 모달을 열고 성경 구절을 표시하는 함수
 * @param {string} reference - 표시할 성경 구절의 참조 (예: '창세기 1:1')
 */
function showVerse(reference) {
    // 1. 데이터 가져오기
    const text = bibleData[reference] || '구절을 찾을 수 없습니다.';

    // 2. 모달에 내용 채우기
    verseTitle.textContent = reference;
    verseText.textContent = text;

    // 3. 모달 표시 (전체 화면)
    modal.classList.remove('hidden');

    // 4. (선택 사항) 모달이 열렸을 때 본문 스크롤 방지
    document.body.style.overflow = 'hidden';
}

/**
 * 전체 화면 모달을 닫는 함수
 */
function closeVerse() {
    // 1. 모달 숨기기
    modal.classList.add('hidden');

    // 2. (선택 사항) 본문 스크롤 허용
    document.body.style.overflow = 'auto';
}

// 이벤트 리스너 등록
// HTML 버튼의 onclick 속성에서 showVerse 함수를 직접 호출하므로, 여기서는 닫기 버튼만 등록합니다.
closeBtn.addEventListener('click', closeVerse);

// ESC 키를 눌러 닫는 기능 추가
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeVerse();
    }
});

// showVerse 함수를 전역으로 노출하여 HTML에서 사용할 수 있도록 합니다.
window.showVerse = showVerse;
