import Session from "./Session"

let sess = new Session()

let script = async () => {
    var res = await sess.get("https://shop-usa.palaceskateboards.com/")
    .then((x) => x)
    console.log(res.url)
    console.log(res.data.body.innerHTML)
}

script()