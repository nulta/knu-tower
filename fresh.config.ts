import { defineConfig } from "$fresh/server.ts"
import { Database } from "/core/Database.ts"
import { FetcherManager } from "/core/FetcherManager.ts"
import { KnuFetcher } from "/core/fetcher/KnuFetcher.ts"
import { XeFetcher } from "/core/fetcher/XeFetcher.ts"

Database.initialize("database.db")

// Register the fetchers
;(() => {
    // KNU
    FetcherManager.register(
        new KnuFetcher("academic@knu", {boardId: "stu_812"})
    )

    // Dongari
    FetcherManager.register(
        new XeFetcher("notice@dongari", {
            url: "http://dongari.knu.ac.kr/bbs/board.php?bo_table=notice",
            noYear: true,
        })
    )

    // CSE
    FetcherManager.register(
        new XeFetcher("notice@cse", {url: "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_1&sca=일반공지"})
    )
    
    FetcherManager.register(
        new XeFetcher("academic@cse", {url: "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_1&sca=학사"})
    )
    
    FetcherManager.register(
        new XeFetcher("scholarship@cse", {url: "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_1&sca=장학"})
    )
    
    FetcherManager.register(
        new XeFetcher("cse-ac@cse", {url: "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_1&sca=심컴"})
    )
    
    FetcherManager.register(
        new XeFetcher("cse-gs@cse", {url: "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_1&sca=글솝"})
    )
    
    FetcherManager.register(
        new XeFetcher("cse-ai@cse", {url: "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_1&sca=인컴"})
    )
    
    FetcherManager.register(
        new XeFetcher("grad@cse", {url: "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_1&sca=대학원"})
    )
    
    FetcherManager.register(
        new XeFetcher("work@cse", {url: "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_3_a"})
    )
    
    FetcherManager.register(
        new XeFetcher("job@cse", {
            url: "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_3_b",
            disableDeduplication: true,
        })
    )

    FetcherManager.register(
        new XeFetcher("event@cse", {url: "https://cse.knu.ac.kr/bbs/board.php?bo_table=sub5_4"})
    )

    // SEE
    const seeSelector = {
        boardRow: "div.board_body > table > tbody > tr",
        title: "td.left > a",
        remoteId: "td[scope=row]",
        remoteUrl: "td.left > a",
        timestamp: "td:nth-child(4)",
    }

    FetcherManager.register(
        new XeFetcher("subject@see", {
            url: "https://see.knu.ac.kr/content/board/notice.html?f_opt_1=cls",
            elementSelector: seeSelector,
            replaceTitle: /^수업\s*/,
        })
    )

    FetcherManager.register(
        new XeFetcher("academic@see", {
            url: "https://see.knu.ac.kr/content/board/notice.html?f_opt_1=clg",
            elementSelector: seeSelector,
            replaceTitle: /^학적\s*/,
        })
    )

    FetcherManager.register(
        new XeFetcher("job@see", {
            url: "https://see.knu.ac.kr/content/board/notice.html?f_opt_1=job",
            elementSelector: seeSelector,
            replaceTitle: /^취업\s*/,
            disableDeduplication: true,
        })
    )

    FetcherManager.register(
        new XeFetcher("scholarship@see", {
            url: "https://see.knu.ac.kr/content/board/notice.html?f_opt_1=sch",
            elementSelector: seeSelector,
            replaceTitle: /^장학\s*/,
        })
    )

    FetcherManager.register(
        new XeFetcher("event@see", {
            url: "https://see.knu.ac.kr/content/board/notice.html?f_opt_1=evt",
            elementSelector: seeSelector,
            replaceTitle: /^행사\s*/,
        })
    )

    FetcherManager.register(
        new XeFetcher("notice@see", {
            url: "https://see.knu.ac.kr/content/board/notice.html?f_opt_1=etc",
            elementSelector: seeSelector,
            replaceTitle: /^기타\s*/,
        })
    )

    FetcherManager.register(
        new XeFetcher("seminar@see", {
            url: "https://see.knu.ac.kr/content/board/seminar.html",
            elementSelector: seeSelector,
        })
    )
})()

FetcherManager.initialize()

export default defineConfig({})
