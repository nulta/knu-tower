import { IconUserEdit } from "/components/TablerIcons.tsx"
import { Signal } from "@preact/signals"

export function TopBar(props: { signal: Signal<boolean> }) {
    const date = new Date()
    const mm = (date.getMonth()+1).toString().padStart(2,"0")
    const dd = date.getDate().toString().padStart(2,"0")
    const day = ["일","월","화","수","목","금","토"][date.getDay()]
    const dateStr = `${date.getFullYear()}/${mm}/${dd} (${day})`

    const { signal } = props

    return (
        <div class="top-bar">
            <time>{dateStr}</time>
            <button class="link-like" onClick={ (e) => {signal.value = true} }>
                <IconUserEdit size="18"/>
                개인화
            </button>
        </div>
    )
}