import { HomeEventsPanel } from "/components/HomeEventsPanel.tsx"
import { HomeCafeteriaPanel } from "/components/HomeCafeteriaPanel.tsx"
import { HomeNoticePanel } from "/components/HomeNoticePanel.tsx"
import { IconUserEdit } from "/components/TablerIcons.tsx"

const date = new Date()
const mm = (date.getMonth()+1).toString().padStart(2,"0")
const dd = date.getDate().toString().padStart(2,"0")
const day = ["일","월","화","수","목","금","토"][date.getDay()]
const dateStr = `${date.getFullYear()}/${mm}/${dd} (${day})`

export default function Home() {
    return (
        <main class="home">
            <div>
                <time>{dateStr}</time>
                <a href="#"><IconUserEdit size="18"/> 개인화</a>
            </div>
            <HomeNoticePanel />
            <HomeCafeteriaPanel />
            <HomeEventsPanel />
        </main>
    )
}
