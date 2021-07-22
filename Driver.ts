import Reply from "./Reply"
import Session from "./Session"

let sess = new Session()

let print = (input: Reply) => {
    if (!Settings.ENABLE_LOG) {
        return
    }
    console.log(`[Reply/${input.status}]: ${input.url}`)
}

// Script
(async () => {
})()