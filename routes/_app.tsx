import { type PageProps } from "$fresh/server.ts"
import { Header } from "/components/Header.tsx"

export default function App({ Component }: PageProps) {
    return (
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>KNU 송신탑</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
                <Header />
                <Component />
                <footer class="site-footer">
                    <p>본 웹 사이트는 경북대학교의 공식 웹 사이트가 아닙니다.</p>
                </footer>
            </body>
        </html>
    )
}
