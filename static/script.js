
;(() => {
    const wordToHide = new Set(localStorage.getItem('wordToHide')?.split(/[ \n]/) || [])
    const wordToHighlight = new Set(localStorage.getItem('wordToHighlight')?.split(/[ \n]/) || [])

    window.hideWords = () => {
        const posts = document.querySelectorAll('.board-list > a')
        for (const post of posts) {
            for (const word of wordToHide) {
                if (post.innerText.includes(word)) {
                    post.classList.add('hidden-item')
                }
            }
            for (const word of wordToHighlight) {
                if (post.innerText.includes(word)) {
                    post.classList.add('highlighted-item')
                }
            }
        }
    }

    setInterval(hideWords, 10000)
})()
