import { USER_AGENT, CONTENT_TYPE } from "./Settings"
import fetch, { Headers, Response } from "node-fetch"
import Reply from "./Reply"
import { JSDOM } from "jsdom"
import { URLSearchParams } from "url"

export default class Session {

    headers = new Headers()
    cookies = new Map<string, string>()

    public constructor() {
        this.headers.set("User-Agent", USER_AGENT)
        this.headers.set("Content-Type", CONTENT_TYPE)
    }

    get = async (url: string): Promise<Reply> => {
        return await fetch(url, {
            "method": "GET",
            "headers": this.headers
        })
        .then((res) => this.createResponse(res))
    }

    post = async (url: string, data: Map<string, string>): Promise<Reply> => {
        return await fetch(url, {
            "method": "POST",
            "headers": this.headers,
            "body": new URLSearchParams(data)
        })
        .then((res) => this.createResponse(res))
    }

    private createResponse = async (res: Response): Promise<Reply> => {

        var result = new Reply()

        result.url = res.url
        result.status = res.status
        result.statusText = res.statusText

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
        this.headers.set("Cookie", this.getCookies())
        console.log("type: " + res.type)

        await res.text().then((data) => {
            result.data = new JSDOM(data).window.document
        })
        return result
    }

    private setHeader = (name: string, value: string): void => this.headers.set(name, value)

    getCookies = (): string => {
        var result = ""
        this.cookies.forEach((value, key) => {
            result = result.concat(key + "=" + value + "; ")
        })
        result = result.slice(0, result.length - 2)
        return result
    }
}