import { Log } from "/core/libs/Log.ts"
import { IFetcher, FetchedPost } from "/core/fetcher/IFetcher.ts"
import { PostCategory } from "/core/PostManager.ts"
import { DOMParser } from "@b-fuze/deno-dom"

type XeFetcherOptions = {
    url: string
    category?: PostCategory
    interval?: number
    noYear?: boolean
    elementSelector?: {
        boardRow: string
        title: string
        remoteId: string
        remoteUrl: string
        timestamp: string
    }
    replaceTitle?: RegExp
    disableDeduplication?: boolean
}

export class XeFetcher implements IFetcher {
    desiredInterval: number
    desiredCategory: PostCategory
    name: string
    listUrl: string

    shouldGuessYear: boolean
    selector: NonNullable<XeFetcherOptions["elementSelector"]>
    replaceTitle?: RegExp
    disableDeduplication?: boolean

    constructor(name: string, options: XeFetcherOptions) {
        this.desiredInterval = options.interval ?? 1000 * 60 * 30
        this.desiredCategory = options.category ?? "notice"
        this.listUrl = options.url
        this.name = name
        this.shouldGuessYear = options.noYear ?? false
        this.disableDeduplication = options.disableDeduplication

        const {boardRow, title, remoteId, remoteUrl, timestamp} = {
            boardRow: "form#fboardlist table > tbody > tr",
            title: "td.td_subject .bo_tit a",
            remoteId: "td.td_num2",
            remoteUrl: "td.td_subject .bo_tit a",
            timestamp: "td.td_datetime",
            ...options.elementSelector
        }
        this.selector = {boardRow, title, remoteId, remoteUrl, timestamp}

        this.replaceTitle = options.replaceTitle
    }

    fetchCount = 0
    async fetchListPage(page: number) {
        const url = new URL(this.listUrl)
        url.searchParams.set("page", page + "")

        this.fetchCount++
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

    extractPostList(html: string, lastPostDate?: Date): FetchedPost[] {
        lastPostDate ??= new Date()
        const doc = new DOMParser().parseFromString(html, "text/html")
        const elemList = doc.querySelectorAll(this.selector.boardRow)
        const posts = []

        for (const elem of elemList) {
            const remoteId = elem.querySelector(this.selector.remoteId)?.innerText?.trim()
            let title = elem.querySelector(this.selector.title)?.innerText?.trim()
            let remoteUrl = elem.querySelector(this.selector.remoteUrl)?.getAttribute("href")
            const timestamp = elem.querySelector(this.selector.timestamp)?.innerText?.trim()
            let createdAt = new Date(timestamp ?? "").getTime()

            if (!title || !remoteId || !remoteUrl || !createdAt || !parseInt(remoteId)) {
                // what??
                continue
            }

            remoteUrl = new URL(remoteUrl, this.listUrl).toString()

            if (this.shouldGuessYear) {
                // Try to guess the posts' upload year
                const date = new Date(timestamp!)
                const lastDay = lastPostDate.getMonth() * 100 + lastPostDate.getDate()
                const thisDay = date.getMonth() * 100 + date.getDate()
                if (lastDay < thisDay) {
                    date.setFullYear(lastPostDate.getFullYear() - 1)
                } else {
                    date.setFullYear(lastPostDate.getFullYear())
                }
                createdAt = date.getTime()
            }

            if (this.replaceTitle) {
                title = title.replace(this.replaceTitle, "")
            }

            posts.push({
                title,
                remoteId: remoteId.padStart(6, "0"),
                remoteUrl,
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
        let lastPostDate: Date = new Date()

        while (true) {
            const html = await this.fetchListPage(page)
            const posts = this.extractPostList(html, lastPostDate)

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

            // Check the date
            lastPostDate = new Date(posts[posts.length - 1].createdAt)
            const maxTime = 1000*60*60*24*365*2  // 2 years
            if (lastPostDate.getTime() < Date.now() - maxTime) {
                break
            }

            fetchedData.push(...posts)
            page++
        }

        return fetchedData
    }
}