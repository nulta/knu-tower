import { BoardTable } from "/components/BoardTable.tsx"

export function HomeNoticePanel() {
    return (
        <article class="home-panel">
            <h2><a href="/notice">공지사항</a></h2>
            <BoardTable category="notice" />
        </article>
    )
}
