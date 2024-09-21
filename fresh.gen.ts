// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx"
import * as $_app from "./routes/_app.tsx"
import * as $asdf from "./routes/asdf.tsx"
import * as $index from "./routes/index.tsx"
import * as $notice from "./routes/notice.tsx"

import { type Manifest } from "$fresh/server.ts"

const manifest = {
    routes: {
        "./routes/_404.tsx": $_404,
        "./routes/_app.tsx": $_app,
        "./routes/asdf.tsx": $asdf,
        "./routes/index.tsx": $index,
        "./routes/notice.tsx": $notice,
    },
    islands: {},
    baseUrl: import.meta.url,
} satisfies Manifest

export default manifest
