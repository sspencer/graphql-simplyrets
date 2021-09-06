const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('./types')
const resolvers = require('./resolvers')

const GET_PROPERTIES = `
query Query($city: String!) {
  getProperties(city: $city) {
    mlsId
    address { city }
  }
}
`

// test servers that have authorized and unauthorized users
const authServer = new ApolloServer({ typeDefs, resolvers, context: () => ({ user: process.env.SIDE_USER }) });
const unauthServer = new ApolloServer({ typeDefs, resolvers, context: () => ({ user: "dont@letme.in" }) });

test('fetch properties with authorized user', async () => {
    const result = await authServer.executeOperation({ query: GET_PROPERTIES, variables: { city: "Houston" } });

    expect(result.errors).toBeUndefined()
    expect(result.data?.getProperties.length).toBeGreaterThanOrEqual(1)
    expect(result.data?.getProperties[0]).toHaveProperty("mlsId")
    expect(result.data?.getProperties[0]).toHaveProperty("address.city")
});

test('fetch properties without mandatory city', async () => {
    const result = await authServer.executeOperation({ query: GET_PROPERTIES, variables: { state: "Oregon" } });
    expect("" + result.errors).toEqual(expect.stringContaining("UserInputError"))
});

test('fetch properties with unauthorized user', async () => {
    const result = await unauthServer.executeOperation({ query: GET_PROPERTIES, variables: { city: "Houston" } });

    expect("" + result.errors).toEqual(expect.stringContaining("Authentication Error"))
    expect(result.data?.getProperties).toBeNull()
});
