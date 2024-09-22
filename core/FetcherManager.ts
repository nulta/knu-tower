import { IFetcher, FetchedPost } from "/core/fetcher/IFetcher.ts"
import { Log } from "/core/libs/Log.ts"
import { PostManager, PostImportData } from "/core/PostManager.ts"
import { Database } from "/core/Database.ts"
import { PostTrimmer } from "/core/PostTrimmer.ts"

export class FetcherManager {
    private static fetchers: Map<string, IFetcher> = new Map()

    static initialize() {
        // Set the interval to update the fetchers every 30min
        setInterval(this.update.bind(this), 1000 * 60 * 30)

        Log.info("FetcherManager: initialized!")

        this.update()
    }

    /**
     * Register a fetcher.
     * @param fetcher The fetcher to register.
     */
    static register(fetcher: IFetcher) {
        const {name} = fetcher
        if (this.fetchers.has(name)) {
            Log.warn(`FetcherManager: Fetcher ${fetcher.name} is already registered!`)
            return
        }

        // Register the fetcher
        this.fetchers.set(name, fetcher)

        // Push the metadata to the database
        Database.execute(
            "INSERT OR IGNORE INTO sources (name) VALUES (?)",
            [name]
        )

        Log.info(`FetcherManager: Registered fetcher: ${name}`)
    }

    /**
     * Update all the fetchers.
     * This method is called periodically.
     */
    static update() {
        this.fetchers.forEach(async (fetcher) => {
            // Load the fetcher metadata
            const [lastFetchedAt, untilId] = Database.queryRow<[number, string]>(
                "SELECT last_fetched_at, last_fetched_id FROM sources WHERE name = ?",
                [fetcher.name]
            ) ?? [0, undefined]

            // Check if the fetcher should be fetched
            if (Date.now() - lastFetchedAt < fetcher.desiredInterval + 10_000) {
                return
            }

            // Fetch the data
            const fetchedData = await fetcher.fetchData({untilId})
            this.processFetchedData(fetcher, fetchedData)

            // Update the metadata
            const lastFetchedId =
                fetchedData.length != 0
                ? fetchedData.reduce((max, {remoteId}) => (max < remoteId ? remoteId : max), "")
                : untilId

            Database.execute(
                "UPDATE sources SET last_fetched_at = ?, last_fetched_id = ? WHERE name = ?",
                [Date.now(), lastFetchedId, fetcher.name]
            )
        })
    }

    static checkForDuplicatePost(post: PostImportData) {
        const {title, createdAt} = post
        const year = new Date(createdAt).getFullYear()
        const normalizedTitle = PostTrimmer.normalizeTitle(title, year)

        const existingPost = Database.queryValue<string>(
            "SELECT id FROM posts_normalized WHERE normalized_title = ?",
            [normalizedTitle]
        )

        return existingPost
    }

    static processFetchedData(fetcher: IFetcher, fetchedData: FetchedPost[]) {
        fetchedData.forEach((data) => {
            let post: PostImportData = {
                title: data.title,
                content: data.content ?? null,
                category: fetcher.desiredCategory,
                source: fetcher.name,
                remoteUrl: data.remoteUrl,
                createdAt: data.createdAt,
                precision: "d"
            }

            post = PostTrimmer.trimPost(post)

            if (!fetcher.disableDeduplication) {
                const existingPost = this.checkForDuplicatePost(post)
                if (existingPost) {
                    Log.info(`FetcherManager: Post ${post.title} is duplicated! Skipping...`)
                    return
                }
            }

            const id = PostManager.importPost(post)

            if (!fetcher.disableDeduplication) {
                const year = new Date(post.createdAt).getFullYear()
                const normalizedTitle = PostTrimmer.normalizeTitle(post.title, year)

                Database.execute(
                    "INSERT INTO posts_normalized (normalized_title, id) VALUES (?, ?)",
                    [normalizedTitle, id]
                )
            }
        })

    }
}
