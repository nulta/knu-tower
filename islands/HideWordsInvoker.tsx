import { useCallback } from "preact/hooks"

export function HideWordsInvoker() {
    useCallback(() => {
        window["hideWords"]!()
    }, [])

    return (
        <div onLoad={(_) => window["hideWords"]!()}></div>
    )
}