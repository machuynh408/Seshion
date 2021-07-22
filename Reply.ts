import { JSDOM } from "jsdom"

export default class Reply {
    url: string
    status: number
    statusText: string

    private _data: string

    constructor(data: string) {
        this._data = data
    }

    document = (): Document => {
        var doc
        try {
            doc = new JSDOM(this._data).window.document
        }
        finally {
            return doc
        }
    }

    json = (): Object => {
        var j
        try {
            j = JSON.parse(this._data)
        }
        finally {
            return j
        }
    }
}