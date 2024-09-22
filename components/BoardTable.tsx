import { PostManager, PostCategory } from "/core/PostManager.ts"
import { IdGenerator } from "/core/libs/IdGenerator.ts"

export function BoardTable({ category, limit }: { category: PostCategory, limit?: number }) {
    const posts = PostManager.getPostList(category, limit ?? 20, "0")

    return (
        <ul class="board-list grow-1">
            {
                posts.map((post) => {
                    const createdAt = IdGenerator.getTime(post.id)
                    let timestamp = ""
                    if (new Date().getFullYear() != createdAt.getFullYear()) {
                        timestamp = `${createdAt.getFullYear()}.`
                    }
                    timestamp += `${(createdAt.getMonth() + 1 + "").padStart(2,"0")}`
                    timestamp += `.${(createdAt.getDate() + "").padStart(2,"0")}`

                    return (
                        <a href={post.remoteUrl ?? "#"} target="blank" key={post.id}>
                            <li>
                                <div>{post.title} <span class="small-text">{post.source}</span></div>
                                <div>{timestamp}</div>
                            </li>
                        </a>
                    )
                })
            }
        </ul>
    )
}
