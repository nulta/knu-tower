import { PostCategory } from "/core/PostManager.ts"

export type FetchedPost = {
    remoteId: string
    remoteUrl: string
    title: string
    createdAt: number
    content?: string
}

/**
 * Fetcher fetches and processes the data from the specified server.
 */
export interface IFetcher {
    /**
     * The desired fetch interval, in milliseconds, between each fetch.
     */
    desiredInterval: number

    /**
     * The desired category to fetch.
     */
    desiredCategory: PostCategory

    /**
     * Whether to disable the post deduplication between other publishers.
     */
    disableDeduplication?: boolean

    /**
     * The unique name of the fetcher.
     */
    name: string

    /**
     * Fetches the data from the server.
     * @returns The list of fetched data.
     */
    fetchData(options: {untilId?: string}): Promise<FetchedPost[]>
}
