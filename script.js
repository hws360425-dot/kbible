// 성경 데이터를 저장할 전역 변수
let bibleData = {};
let currentChapter = 1;
const totalChapters = 50; // 창세기 총 장 수

// DOM 요소와 이벤트 리스너는 DOM이 로드된 후 설정
document.addEventListener('DOMContentLoaded', async () => {
    // DOM 요소 선택
    const modal = document.getElementById('full-screen-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const verseTitle = document.getElementById('verse-title');
    const verseText = document.getElementById('verse-text');
    const chapterButtonsContainer = document.getElementById('chapter-buttons');
    const versesContainer = document.getElementById('verses-container');

    // gen.json 파일에서 성경 데이터 로드
    try {
        const response = await fetch('gen.json');
        if (!response.ok) {
            throw new Error('Failed to load Bible data');
        }
        bibleData = await response.json();
        console.log('Bible data loaded:', bibleData);
        
        // 데이터 로드 후 장 버튼 생성
        generateChapterButtons();
        
        // 기본적으로 1장 표시
        showChapter(1);
    } catch (error) {
        console.error('Error loading Bible data:', error);
        if (versesContainer) {
            versesContainer.innerHTML = '<p style="color: red; padding: 20px;">성경 데이터를 불러오는데 실패했습니다. gen.json 파일을 확인해주세요.</p>';
        }
    }

    /**
     * 장 버튼들을 생성하는 함수
     */
    function generateChapterButtons() {
        if (!chapterButtonsContainer) {
            console.error('Chapter buttons container not found');
            return;
        }

        chapterButtonsContainer.innerHTML = ''; // 기존 버튼 제거
        
        for (let i = 1; i <= totalChapters; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = 'chapter-btn';
            if (i === 1) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => showChapter(i));
            chapterButtonsContainer.appendChild(button);
        }
    }

    /**
     * 특정 장의 구절들을 표시하는 함수
     * @param {number} chapter - 표시할 장 번호
     */
    window.showChapter = function(chapter) {
        if (!versesContainer) {
            console.error('Verses container not found');
            return;
        }

        currentChapter = chapter;
        
        // 모든 장 버튼에서 active 클래스 제거
        const allButtons = document.querySelectorAll('.chapter-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));
        
        // 현재 장 버튼에 active 클래스 추가
        const currentButton = Array.from(allButtons).find(btn => btn.textContent == chapter);
        if (currentButton) {
            currentButton.classList.add('active');
        }

        // 해당 장의 데이터 가져오기
        const chapterData = bibleData[chapter];
        
        if (!chapterData || Object.keys(chapterData).length === 0) {
            versesContainer.innerHTML = `<p style="padding: 20px; color: #666;">창세기 ${chapter}장의 구절을 찾을 수 없습니다.</p>`;
            return;
        }

        // 구절들을 HTML로 변환
        let versesHTML = `<h2 style="padding: 20px; padding-bottom: 10px; margin: 0;">창세기 ${chapter}장</h2>`;
        versesHTML += '<div style="padding: 0 20px 20px 20px;">';
        
        // 구절 번호순으로 정렬
        const verseNumbers = Object.keys(chapterData).map(Number).sort((a, b) => a - b);
        
        verseNumbers.forEach(verseNum => {
            const verseText = chapterData[verseNum];
            versesHTML += `
                <div class="verse-item" style="margin-bottom: 15px; line-height: 1.6;">
                    <span style="font-weight: bold; color: #2563eb; margin-right: 8px;">${verseNum}.</span>
                    <span>${verseText}</span>
                </div>
            `;
        });
        
        versesHTML += '</div>';
        versesContainer.innerHTML = versesHTML;
        
        // 컨테이너를 맨 위로 스크롤
        versesContainer.scrollTop = 0;
    }

    /**
     * 전체 화면 모달을 닫는 함수
     */
    window.closeVerse = function() {
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * 전체 화면 모달을 열고 성경 구절을 표시하는 함수
     * @param {number} chapter - 장 번호
     * @param {number} verse - 절 번호
     */
    window.showVerse = function(chapter, verse) {
        if (!modal || !verseTitle || !verseText) {
            console.error('Modal elements not found');
            return;
        }

        // 데이터 가져오기
        const chapterData = bibleData[chapter];
        const text = chapterData && chapterData[verse] 
            ? chapterData[verse] 
            : '구절을 찾을 수 없습니다.';

        // 모달에 내용 채우기
        verseTitle.textContent = `창세기 ${chapter}:${verse}`;
        verseText.textContent = text;

        // 모달 표시
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // 이벤트 리스너 등록
    if (closeBtn) {
        closeBtn.addEventListener('click', window.closeVerse);
    }

    // ESC 키를 눌러 닫는 기능
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            window.closeVerse();
        }
    });
});
