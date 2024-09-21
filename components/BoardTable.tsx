export function BoardTable() {
    return (
        <article class="home-panel">
            <h2>공지사항</h2>
            <ul class="board-list grow-1">
                <a href="/notice/2">
                    <li class="read">
                        <div>제목제목제목제목 <span class="small-text">학사공지</span></div>
                        <div>01/01</div>
                    </li>
                </a>
                <li>
                    <div>제목제목제목제목 <span class="small-text">컴퓨터학부</span></div>
                    <div>01/01</div>
                </li>
                <li>
                    <div>제목제목제목제목 <span class="small-text">IT대학</span></div>
                    <div>01/01</div>
                </li>
            </ul>
        </article>
    )
}
