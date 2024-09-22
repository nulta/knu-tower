import { Log } from "/core/libs/Log.ts"
import { IFetcher, FetchedPost } from "/core/fetcher/IFetcher.ts"
import { PostCategory } from "/core/PostManager.ts"
import { DOMParser } from "@b-fuze/deno-dom"

type KnuFetcherOptions = {
    boardId: string
    category?: PostCategory
    interval?: number
}

export class KnuFetcher implements IFetcher {
    desiredInterval: number
    desiredCategory: PostCategory
    name: string
    boardId: string

    readonly listUrl = "https://on.knu.ac.kr/board/board.brd"
    readonly readUrl = "https://on.knu.ac.kr/board/read.brd"

    constructor(name: string, options: KnuFetcherOptions) {
        this.desiredInterval = options.interval ?? 1000 * 60 * 30
        this.desiredCategory = options.category ?? "notice"
        this.boardId = options.boardId
        this.name = name
    }

    fetchCount = 0
    async fetchListPage(page: number) {
        const url = new URL(this.listUrl)
        url.searchParams.set("boardId", this.boardId)
        url.searchParams.set("pageSize", "100")
        url.searchParams.set("page", page + "")

        if (this.fetchCount > 20) {
            Log.warn(`${this.name}: Waiting for 5 seconds...`)
            await new Promise((resolve) => setTimeout(resolve, 5000))
            this.fetchCount = 0
        }

        Log.info(`${this.name}: Fetching page ${page}...`)
        return await fetch(
            url.toString(),
            {headers: {"Accept-Language": "ko-KR"}}
        ).then((res) => res.text())
    }

    extractPostList(html: string): FetchedPost[] {
        const doc = new DOMParser().parseFromString(html, "text/html")
        const elemList = doc.querySelectorAll(".board-list li.C.tbody")
        const posts = []

        for (const elem of elemList) {
            const title = elem.querySelector(".title a")?.textContent?.trim()
            const remoteId = elem.querySelector(".td.numb")?.textContent?.trim()
            const urlId = elem.getAttribute("onclick")?.match(/\(.+?, *'(\d+)'\)/)?.[1]
            const timestamp = elem.querySelector("div:nth-child(4)")?.textContent?.trim()
            const createdAt = new Date(timestamp ?? "").getTime()

            if (!title || !remoteId || !urlId || !createdAt || !parseInt(remoteId)) {
                // what??
                continue
            }

            posts.push({
                title,
                remoteId: remoteId.padStart(6, "0"),
                remoteUrl: `${this.readUrl}?boardId=${this.boardId}&bltnNo=${urlId}`,
                createdAt,
            })
        }

        return posts
    }

    async fetchData({untilId}: {untilId?: string}) {
        untilId ??= ""
        const fetchedData: FetchedPost[] = []
        let page = 1
        let lastLastPost: string = ""

        while (true) {
            const html = await this.fetchListPage(page)
            const posts = this.extractPostList(html)

            // Check if we skipped the last page
            if (posts.length == 0) { break }
            const lastPost = posts[posts.length - 1].remoteId
            if (lastPost == lastLastPost) { break }
            lastLastPost = lastPost

            // Check the untilId
            const untilIndex = posts.findIndex((post) => post.remoteId <= untilId)
            if (untilIndex != -1) {
                fetchedData.push(...posts.slice(0, untilIndex))
                break
            }

            fetchedData.push(...posts)
            page++
        }

        return fetchedData
    }
}