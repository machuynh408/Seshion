import Reply from "./Reply"
import { URLSearchParams } from "url"
import fetch, { Headers, Response } from "node-fetch"

export default class Session {

    headers = new Headers()
    cookies = new Map<string, string>()

    constructor() {
        this.headers.set("User-Agent", Settings.USER_AGENT)
        this.headers.set("Content-Type", Settings.CONTENT_TYPE)
    }

    get = async (url: string): Promise<Reply> => {
        if (Settings.ENABLE_LOG) {
            console.log("[Fetch/Get]: " + url)
        }

        var options = {
            "method": "GET",
            "headers": this.headers,
        }

        return await fetch(url, options)
        .then((res) => this.createResponse(res))
    }

    post = async (url: string, data: Map<string, string>): Promise<Reply> => {
        if (Settings.ENABLE_LOG) {
            console.log("[Fetch/Post]: " + url)
        }

        var options = {
            "method": "POST",
            "headers": this.headers,
            "body": new URLSearchParams(data)
        }

        return await fetch(url, options)
        .then(async (res) => await this.createResponse(res))
    }

    private createResponse = async (res: Response): Promise<Reply> => {
    
        const cookies = res.headers.raw()['set-cookie']
        cookies.forEach((entry) => {
            const source = entry.split(' ')
            const item = source[0].split('=')

            var name = item[0].trim()
            var value = item[1].trim()
            if (value.endsWith(';') || value.endsWith(',')) {
                value = value.slice(0, value.length - 1)
            }
            this.cookies.set(name, value)
        })
        this.headers.set("Cookie", this.cookie())

        const text = await res.text().then((text) => text)

        var result = new Reply(text)

        result.url = res.url
        result.status = res.status
        result.statusText = res.statusText

        return result
    }

    cookie = (): string => {
        var result = ""
        this.cookies.forEach((value, key) => result = result.concat(key + "=" + value + "; "))
        return result.slice(0, result.length - 2)
    }
}