import { USER_AGENT, CONTENT_TYPE } from "./Settings"
import fetch, { Headers } from "node-fetch"
import Response from "./Response"
import CustomHeaders from "./CustomHeaders"

const cookieIgnoreArr: Set<string> = new Set<string>(["path", "expires", "secure", "samesite", "domain"])

export default class Session {

    headers = new Headers()
    cookies = new Map<string, string>()

    public constructor() {
        this.headers.set("User-Agent", USER_AGENT)
        this.headers.set("Content-Type", CONTENT_TYPE)
    }

    get = async (url: string) => {

        var result = new Response()
        
        const response = await fetch(url, {
            "method": "GET",
            "headers": this.headers
        })
        .then((res) => {

            result.url = res.url
            result.status = res.statusText
            result.statusText = res.statusText

            const resHeaders = res.headers
            const resCookie = resHeaders.get("set-cookie")

            const arr = resCookie.split(' ')
            for (var x in arr) {
                var y = arr[x]
                if (!y.includes('=')) {
                    continue
                }
                var entry = y.split('=')
                var name = entry[0]
                if (cookieIgnoreArr.has(name.toLowerCase())) {
                    continue
                }
                var value = entry[1].trim()
                if (value.endsWith(';') || value.endsWith(',')) {
                    value = value.slice(0, value.length - 1)
                }
                this.cookies.set(name, value)
            }
            this.getCookies()
            return res.blob()
        })
        .then((blob) => blob.text())
        .then((html) => { })
    }

    setHeader = (name: string, value: string): void => this.headers.set(name, value)

    getCookies = (): string => {
        var result = ""
        this.cookies.forEach((value, key) => {
            result = result.concat(key + "=" + value + "; ")
        })
        result = result.slice(0, result.length - 2)
        return result
    }
}