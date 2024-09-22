import { Database } from "/core/Database.ts"
import { IdGenerator } from "/core/libs/IdGenerator.ts"
import { Log } from "/core/libs/Log.ts"

export type PostCategory = "notice" | "events"
type TimePrecision = "ms" | "s" | "m" | "h" | "d"

type PostCreateData = {
    title: string
    content: string | null
    category: PostCategory
    source: string | null
    remoteUrl: string | null
}

export type PostImportData = PostCreateData & {
    createdAt: number,
    precision: TimePrecision
}

type PostRow = {
    id: string
    title: string
    content: string
    category: PostCategory
    source: string | null
    remote_url: string | null
}

type Post = {
    id: string
    title: string
    content: string
    category: PostCategory
    source: string | null
    remoteUrl: string | null
}

export class PostManager {
    static importPost(data: PostImportData) {
        const id = IdGenerator.withTimeCompensentation(data.createdAt, data.precision)
        const {title, content, category, source, remoteUrl} = data

        Database.execute(
            `INSERT INTO posts (id, title, content, category, source, remote_url)
             VALUES (:id, :title, :content, :category, :source, :remoteUrl);`,
            {id, title, content, category, source, remoteUrl}
        )

        Log.info(`PostManager: New post: ${data.title}`)

        return id
    }

    static createPost(data: PostCreateData) {
        return this.importPost({...data, createdAt: Date.now(), precision: "ms"})
    }

    static getPostList(category: PostCategory, limit: number, startFrom: string): Post[] {
        const posts = Database.queryAll<PostRow>(`
                SELECT * FROM posts
                WHERE category = :category AND id > :startFrom
                ORDER BY id DESC
                LIMIT :limit
            `,
            {category, limit, startFrom}
        )

        return posts.map(
            ({id, title, content, source, remote_url}) => ({
                id, title, content, category, source,
                remoteUrl: remote_url
            })
        )
    }
}