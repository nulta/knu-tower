import { HomeCafeteriaPanel } from "/components/HomeCafeteriaPanel.tsx"
import { HomeNoticePanel } from "/components/HomeNoticePanel.tsx"
import { Signal } from "@preact/signals"

export default function Home({ openOptions }: { openOptions: Signal<boolean> }) {
    return (
        <main class="home">
            <HomeNoticePanel />
            <article class="home-panel text-panel">
                <h2>KNU 송신탑에 대해서</h2>
                <p>
                    <strong>KNU 송신탑</strong>은 경북대학교 학생들을 위한 비공식 공지 모음 및 정보 제공 서비스입니다.
                </p>
                <p>여러 사이트에 흩어진 정보를 한 번에 모아서 보기 위해 만들어졌습니다.</p>
                <p>현재는 다음 정보를 모아서 제공하고 있습니다.</p>
                <ul>
                    <li>공식 홈페이지 학사공지</li>
                    <li>총동아리연합회 공지사항</li>
                    <li>IT대학 컴퓨터학부 공지사항</li>
                    <li>IT대학 전자공학부 공지사항</li>
                </ul>
                <p>추후 더 많은 사이트를 지원할 예정이니 기대해 주세요!</p>
            </article>
        </main>
    )
}
