import { USER_AGENT, CONTENT_TYPE } from "./Settings"
import fetch, { Headers } from "node-fetch"

export default class Session {

    headers = new Headers()

    public constructor() {
        this.headers.set("User-Agent", USER_AGENT)
        this.headers.set("Content-Type", CONTENT_TYPE)
    }

    get = async (url: string) => {
        const response = await fetch(url, {
            "method": "GET",
            "headers": this.headers
        })
        .then((res) => {
            const resHeaders = res.headers
            const cookie = resHeaders.get("set-cookie")
            console.log(cookie)
            return res.blob()
        })
        .then((blob) => blob.text())
        .then((html) => {
            //console.log(html)
        })
    }

    setHeader(name: string, value: string) {
        this.headers.set(name, value)
    } 
}