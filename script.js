// 가상의 성경 데이터베이스 (실제로는 API 호출 등으로 가져와야 함)
// 이 데이터는 DOM에 의존하지 않으므로 전역에 유지합니다.
const bibleData = {
    '창세기 1:1': '태초에 하나님이 천지를 창조하시니라.',
    '요한복음 3:16': '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라.',
    // ... 더 많은 구절
};

// DOM 요소와 이벤트 리스너는 DOM이 로드된 후 설정해야 합니다.
document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 선택을 이벤트 리스너 안으로 이동
    const modal = document.getElementById('full-screen-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const verseTitle = document.getElementById('verse-title');
    const verseText = document.getElementById('verse-text');

    /**
     * 전체 화면 모달을 닫는 함수
     * 이 함수는 DOM 요소에 접근하므로, DOMContentLoaded 스코프 내에서 정의하거나,
     * 전역에서 접근할 수 있도록 window 객체에 할당해야 합니다.
     */
    window.closeVerse = function() {
        // 1. 모달 숨기기
        modal.classList.add('hidden');

        // 2. (선택 사항) 본문 스크롤 허용
        document.body.style.overflow = 'auto';
    }

    /**
     * 전체 화면 모달을 열고 성경 구절을 표시하는 함수
     * 이 함수는 HTML의 onclick에서 호출되므로 window 객체에 할당합니다.
     * @param {string} reference - 표시할 성경 구절의 참조 (예: '창세기 1:1')
     */
    window.showVerse = function(reference) {
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


    // 이벤트 리스너 등록 (이제 closeBtn이 정의되었으므로 오류가 발생하지 않습니다.)
    closeBtn.addEventListener('click', window.closeVerse);

    // ESC 키를 눌러 닫는 기능 추가
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            window.closeVerse();
        }
    });

    // 여기서 성경 목록 생성 함수를 호출합니다.
    // generateBookList(); // (이 함수는 전체 코드가 있어야 호출 가능)
});

