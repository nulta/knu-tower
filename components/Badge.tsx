import { ComponentChildren } from "https://esm.sh/v128/preact@10.19.6/src/index.js"

type BadgeTypes = "critical" | "primary" | "info" | "verbose"
type Param = {children?: ComponentChildren, type?: BadgeTypes}

export function Badge({children, type}: Param) {
    children ??= ""
    type ??= "verbose"

    return (
        <span class={`text-badge ${type}`}>
            {children}
        </span>
    )
}
