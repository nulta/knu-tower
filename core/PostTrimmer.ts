import { PostImportData } from "/core/PostManager.ts"

export class PostTrimmer {
    static trimPost(post: PostImportData): PostImportData {
        let {title, content, category, source, remoteUrl, createdAt} = post

        const year = new Date(createdAt).getFullYear()
        title = title.replace(RegExp(`^${year}학?년도? `), "")
        title = title.replace(/ 안내$/, "")

        return {
            title,
            content,
            category,
            source,
            remoteUrl,
            createdAt,
            precision: post.precision
        }
    }

    /**
     * Aggressively normalize the title of the post.
     * - Remove text in parentheses
     * - Remove all the special characters
     * - Convert to lowercase
     * - Append the year before the title
     * 
     * Normalized title is used to prevent duplicated posts.
     */
    static normalizeTitle(title: string, year: number): string {
        title = title.replace(/\(.*?\)/g, "")
        title = title.replace(/\[.*?\]/g, "")
        title = title.replace(/\<.*?\>/g, "")
        title = title.replace(/[^a-zA-Z0-9가-힣]/g, "")
        title = title.toLowerCase()
        title = year + title
        return title
    }
}