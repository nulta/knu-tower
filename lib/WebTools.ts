import { DOMParser, Document } from "jsr:@b-fuze/deno-dom"

export class WebTools {
    static parseHTML(html: string): Document {
        return new DOMParser().parseFromString(html, "text/html")
    }
}
