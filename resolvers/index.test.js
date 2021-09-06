const resolvers = require("./index")

const noAuth = [{}, { city: "Houston" }, { user: null }]
const auth = [{}, { city: "Houston" }, { user: process.env.SIDE_USER }]
const gp = resolvers.Query.getProperties

test("resolver user not authorized", async () => {
    expect.assertions(1)
    try {
        await gp(...noAuth)
    } catch (e) {
        expect("" + e).toEqual(expect.stringContaining("Authentication Error"))
    }
})

test("resolver user authorized and returns data", async () => {
    expect.assertions(4)
    const data = await gp(...auth)
    expect(data.length).toBeGreaterThanOrEqual(1)
    expect(data[0]).toHaveProperty("privateRemarks")
    expect(data[0]).toHaveProperty("property.roof")
    expect(data[0]).toHaveProperty("address.city")
})