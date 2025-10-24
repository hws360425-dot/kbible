// 성경 데이터를 저장할 전역 변수
let genesisData = {};
let currentChapter = 1;
const bookName = '창세기';
const totalChapters = 50;

// 즐겨찾기 데이터
let favorites = [];

// DOM 요소와 이벤트 리스너는 DOM이 로드된 후 설정
document.addEventListener('DOMContentLoaded', async () => {
    // gen.json 파일에서 창세기 데이터 로드
    try {
        const response = await fetch('gen.json');
        if (!response.ok) {
            throw new Error('Failed to load Bible data');
        }
        genesisData = await response.json();
        console.log('Genesis data loaded:', genesisData);
        
        // 데이터 로드 후 초기화
        initializeBibleList();
        loadFavorites();
    } catch (error) {
        console.error('Error loading Bible data:', error);
        const bibleList = document.getElementById('bibleList');
        if (bibleList) {
            bibleList.innerHTML = '<p style="color: red; padding: 20px;">성경 데이터를 불러오는데 실패했습니다. gen.json 파일을 확인해주세요.</p>';
        }
    }
});

/**
 * 성경 목록 초기화 - 창세기 장 버튼들을 생성
 */
function initializeBibleList() {
    const bibleList = document.getElementById('bibleList');
    if (!bibleList) {
        console.error('Bible list container not found');
        return;
    }

    bibleList.innerHTML = '<h2 style="padding: 20px; margin: 0; border-bottom: 1px solid #eee;">창세기</h2>';
    
    // 장 버튼들을 담을 컨테이너 생성
    const chaptersContainer = document.createElement('div');
    chaptersContainer.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 10px; padding: 20px;';
    
    // 각 장에 대한 버튼 생성
    for (let i = 1; i <= totalChapters; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}장`;
        button.style.cssText = 'padding: 15px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;';
        button.onmouseover = function() { this.style.background = '#1d4ed8'; };
        button.onmouseout = function() { this.style.background = '#2563eb'; };
        button.onclick = () => viewChapter(i);
        chaptersContainer.appendChild(button);
    }
    
    bibleList.appendChild(chaptersContainer);
}

/**
 * 특정 장의 구절들을 보여주는 함수
 * @param {number} chapter - 표시할 장 번호
 */
function viewChapter(chapter) {
    currentChapter = chapter;
    
    // contentView 모달 표시
    const contentView = document.getElementById('contentView');
    if (!contentView) {
        console.error('Content view not found');
        return;
    }
    
    // 헤더 업데이트
    const verseBook = document.getElementById('verseBook');
    const verseChapter = document.getElementById('verseChapter');
    if (verseBook) verseBook.textContent = bookName;
    if (verseChapter) verseChapter.textContent = `${chapter}장`;
    
    // 구절 표시
    displayVerses(chapter);
    
    // 모달 표시
    contentView.classList.remove('hidden');
}

/**
 * 구절들을 화면에 표시하는 함수
 * @param {number} chapter - 표시할 장 번호
 */
function displayVerses(chapter) {
    const verseDisplay = document.getElementById('verseDisplay');
    if (!verseDisplay) {
        console.error('Verse display not found');
        return;
    }
    
    // 해당 장의 데이터 가져오기
    const chapterData = genesisData[chapter];
    
    if (!chapterData || Object.keys(chapterData).length === 0) {
        verseDisplay.innerHTML = `<p style="padding: 20px; color: #666; text-align: center;">창세기 ${chapter}장의 구절을 찾을 수 없습니다.</p>`;
        return;
    }
    
    // 구절들을 HTML로 변환
    let versesHTML = '';
    
    // 구절 번호순으로 정렬
    const verseNumbers = Object.keys(chapterData).map(Number).sort((a, b) => a - b);
    
    verseNumbers.forEach(verseNum => {
        const verseText = chapterData[verseNum];
        const verseId = `${chapter}:${verseNum}`;
        const isFavorite = favorites.includes(verseId);
        
        versesHTML += `
            <div class="verse-item" style="margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <span style="font-weight: bold; color: #2563eb; margin-right: 8px; font-size: 16px;">${verseNum}</span>
                        <span style="line-height: 1.7; font-size: 15px;">${verseText}</span>
                    </div>
                    <button onclick="toggleFavorite(${chapter}, ${verseNum})" style="background: none; border: none; cursor: pointer; font-size: 20px; padding: 5px 10px; margin-left: 10px;">
                        ${isFavorite ? '★' : '☆'}
                    </button>
                </div>
            </div>
        `;
    });
    
    verseDisplay.innerHTML = versesHTML;
    
    // 스크롤을 맨 위로
    verseDisplay.scrollTop = 0;
}

/**
 * 컨텐츠 뷰를 닫는 함수
 */
function closeContent() {
    const contentView = document.getElementById('contentView');
    if (contentView) {
        contentView.classList.add('hidden');
    }
}

/**
 * 뒤로가기 (성경 목록으로)
 */
function goBack() {
    closeContent();
}

/**
 * 이전 장으로 이동
 */
function navigatePrev() {
    if (currentChapter > 1) {
        viewChapter(currentChapter - 1);
    }
}

/**
 * 다음 장으로 이동
 */
function navigateNext() {
    if (currentChapter < totalChapters) {
        viewChapter(currentChapter + 1);
    }
}

/**
 * 즐겨찾기 토글
 * @param {number} chapter - 장 번호
 * @param {number} verse - 절 번호
 */
function toggleFavorite(chapter, verse) {
    const verseId = `${chapter}:${verse}`;
    const index = favorites.indexOf(verseId);
    
    if (index > -1) {
        // 즐겨찾기 제거
        favorites.splice(index, 1);
    } else {
        // 즐겨찾기 추가
        favorites.push(verseId);
    }
    
    // localStorage에 저장
    saveFavorites();
    
    // 화면 갱신
    displayVerses(currentChapter);
}

/**
 * 즐겨찾기 모달 표시
 */
function showFavoritesModal() {
    const favoritesModal = document.getElementById('favoritesModal');
    const favoritesList = document.getElementById('favoritesList');
    
    if (!favoritesModal || !favoritesList) {
        console.error('Favorites modal not found');
        return;
    }
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">즐겨찾기한 구절이 없습니다.</p>';
    } else {
        let favoritesHTML = '';
        favorites.forEach(verseId => {
            const [chapter, verse] = verseId.split(':').map(Number);
            const verseText = genesisData[chapter] && genesisData[chapter][verse] 
                ? genesisData[chapter][verse] 
                : '구절을 찾을 수 없습니다.';
            
            favoritesHTML += `
                <div style="margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px;">
                    <div style="font-weight: bold; color: #2563eb; margin-bottom: 5px;">
                        창세기 ${chapter}:${verse}
                    </div>
                    <div style="line-height: 1.6;">${verseText}</div>
                </div>
            `;
        });
        favoritesList.innerHTML = favoritesHTML;
    }
    
    favoritesModal.classList.remove('hidden');
}

/**
 * 즐겨찾기 모달 닫기
 */
function closeFavoritesModal() {
    const favoritesModal = document.getElementById('favoritesModal');
    if (favoritesModal) {
        favoritesModal.classList.add('hidden');
    }
}

/**
 * 즐겨찾기를 localStorage에 저장
 */
function saveFavorites() {
    try {
        localStorage.setItem('bibleFavorites', JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

/**
 * localStorage에서 즐겨찾기 불러오기
 */
function loadFavorites() {
    try {
        const saved = localStorage.getItem('bibleFavorites');
        if (saved) {
            favorites = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        favorites = [];
    }
}
