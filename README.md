# GraphQL (Real Estate) Listings Server

The following is a programming assignment to create a GraphQL server with a single query that returns a listings of properties in a specified city.  The queried server returns mocked data.

## Design Considerations

To fetch listing data over HTTP, I decided to use node-fetch for its ease of use.  Towards the end of the project while testing, I discovered Apollo's RESTDataSource.  In hindsight, for ease of mocking during testing, I would have used a data source.

To remain indendent of `api.simplyrets.com` during development, I used my own [http mocking tool](https://github.com/sspencer/mock).  You will find [rets.api](rets.api) and [data/props.json](data/props.json) in support of that tool.  After installing mock, you simply run `mock -r rets.api` and update RETS_URL in .env to point locally.

## Configuration

To simplify configuration values, a `.env` file is checked in at the top of the tree.  It is **not** a best practice to include tokens/passwords in a code repository, but the data is fake, already specified in PLEASE_READ_FIRST.md, and this is a easy mechanism to centralize configuration.

## Running

To run the server, install the required yarn modules (`yarn install`) and run `yarn start`. Once running, visit the [GraphQL Playground](http://localhost:4000/graphql) or try it with curl from the command line.

    curl -H "Content-Type: application/json" \
    -H "Authorization: Bearer 676cfd34-e706-4cce-87ca-97f947c43bd4" \
    -d '{"query":"query{ getProperties(city:\"Houston\") { mlsId }}"}' \
    http://localhost:4000/graphql

## Testing

Assuming the node modules have been installed, unit and integration tests may be run with `yarn test`.
