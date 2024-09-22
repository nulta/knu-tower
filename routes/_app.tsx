import { type PageProps } from "$fresh/server.ts"
import { Partial } from "$fresh/runtime.ts"
import { Header } from "/components/Header.tsx"
import { TopBar } from "/islands/TopBar.tsx"
import { useSignal } from "@preact/signals"
import { SettingDialog } from "/islands/SettingDialog.tsx"

export default function App({ Component }: PageProps) {
    const openOptions = useSignal(false)

    return (
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>KNU 송신탑</title>
                <link rel="stylesheet" href="/styles.css" />
                <script src="/script.js" type="module" defer></script>
            </head>
            <body f-client-nav>
                <Header />
                <TopBar signal={openOptions}/>
                <Partial name="main">
                    <Component />
                </Partial>
                <footer class="site-footer">
                    <p>본 웹 사이트는 경북대학교의 공식 웹 사이트가 아닙니다.</p>
                </footer>
                <SettingDialog signal={openOptions}/>
            </body>
        </html>
    )
}
