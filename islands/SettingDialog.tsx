import { Signal, useSignal } from "@preact/signals"
import { useEffect } from "preact/hooks"

export function SettingDialog(props: { signal: Signal<boolean> }) {
    const { signal } = props

    const wordToHide = useSignal("")
    const wordToHighlight = useSignal("")
    const sourceToHide = useSignal<string[]>([])

    useEffect(() => {
        wordToHide.value = localStorage.getItem("wordToHide") ?? ""
        wordToHighlight.value = localStorage.getItem("wordToHighlight") ?? ""
        sourceToHide.value = localStorage.getItem("sourceToHide")?.split(" ") ?? []

        return () => {
            localStorage.setItem("wordToHide", wordToHide.value)
            localStorage.setItem("wordToHighlight", wordToHighlight.value)
            localStorage.setItem("sourceToHide", sourceToHide.value.join(" "))
        }
    })

    return signal.value ? (
        <div class="setting-dialog-backdrop" onClick={ _ => {signal.value = false} }>
            <dialog open={true} class="setting-dialog" onClick={e => e.stopPropagation()}>
                <h2>개인화</h2>
                <section>
                    <h3>숨길 단어</h3>
                    <textarea rows={4} value={wordToHide.value} onBlur={e => wordToHide.value = (e.target as HTMLInputElement).value}/>

                    <h3>강조할 단어</h3>
                    <textarea rows={4} value={wordToHighlight.value} onBlur={e => wordToHighlight.value = (e.target as HTMLInputElement).value}/>
                    
                    <p>
                        <span class="small-text">단어 사이는 공백이나 줄바꿈으로 구분해주세요.</span>
                    </p>
                </section>
                <button class="big-button" onClick={_ => {signal.value = false}}>닫기</button>
            </dialog>
        </div>
    ) : <></>
}