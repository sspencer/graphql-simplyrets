const auth = require("./index.js")

// no header authorization value
const noToken = { req: { headers: { contentType: "application/json" } } }
const noTokenResult = { user: null }

// authorization with bad token
const randomToken = { req: { headers: { authorization: "bad" } } }
const randomTokenResult = { user: null }

// correct bearer token, but no "Bearer" in value
const noBearer = { req: { headers: { authorization: process.env.SIDE_TOKEN } } }
const noBearerResult = { user: null }

// authorized 
const bearer = { req: { headers: { authorization: `Bearer ${process.env.SIDE_TOKEN}` } } }
const bearerResult = { user: process.env.SIDE_USER }

const tests = [
    ["no token", noToken, noTokenResult],
    ["random token", randomToken, randomTokenResult],
    ["good token, no bearer", noBearer, noBearerResult],
    ["successful auth", bearer, bearerResult],
]

for (const e of tests) {
    test(e[0], () => {
        expect(auth(e[1])).toMatchObject(e[2])
    })
}