import { FreshContext, Handlers } from "$fresh/server.ts"
import { PostManager } from "/core/PostManager.ts"

export const handler: Handlers = {
    GET(_req: Request, ctx: FreshContext) {
        const params = ctx.params

        const startFrom = params.from ?? "0"
        let limit = parseInt(params.limit ?? "100")

        if (limit > 500) {
            limit = 500
        } else if (limit < 1) {
            limit = 1
        }

        const posts = PostManager.getPostList("notice", limit, startFrom)

        return new Response(JSON.stringify(posts), {
            headers: {
                "content-type": "application/json",
            },
        })
    },
}
