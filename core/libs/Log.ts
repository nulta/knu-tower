// deno-lint-ignore-file no-explicit-any

export class Log {
    private static show(color: string, prefix: string, data: any[]) {
        if (typeof data[0] == "string") {
            const [fmtStr, ...fmtData] = data
            console.log("%c%s %c" + fmtStr, `color: ${color}`, prefix, "color: initial", ...fmtData)
        } else {
            console.log("%c%s ", `color: ${color}`, prefix, ...data)
        }
    }

    static error(...fmt: any[]) {
        this.show("#ff0070", "!!", fmt)
    }

    static warn(...fmt: any[]) {
        this.show("#ff8600", "?!", fmt)
    }

    static info(...fmt: any[]) {
        this.show("#00ffbc", " >", fmt)
    }
}
