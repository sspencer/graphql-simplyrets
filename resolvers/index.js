const fetch = require("node-fetch")
const sideUser = process.env.SIDE_USER
const { ApolloError } = require("apollo-server-errors")

async function fetchProperties(city) {
    const username = process.env.RETS_USERNAME
    const password = process.env.RETS_PASSWORD
    const url = process.env.RETS_URL + escape(city)

    console.log(`url: ${url}`, url)
    let response = await fetch(url, {
        method: "get",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
            "Accept-Charset": "utf-8",
            "Authorization": "Basic " + Buffer.from(`${username}:${password}`, "binary").toString("base64")
        }
    })

    if (response.ok) {
        console.log("response ok")
        return response.json()
    } else {
        console.error(`ERROR fetchProperties: ${response.status} ${response.statusText}`)
        return []
    }
}

module.exports = {
    Query: {
        getProperties: (parent, args, context) => {
            if (context.user !== sideUser) {
                throw new ApolloError('Authentication Error', 'User not authorized');
            }

            return fetchProperties(args.city)
        },
    },
}
