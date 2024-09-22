import { BoardTable } from '/components/BoardTable.tsx';

export default function Notice() {
    return (
        <main class="board">
            <article class="home-panel">
                <h2>공지사항</h2>
                <BoardTable category="notice" limit={500} />
            </article>
        </main>
    )
}
