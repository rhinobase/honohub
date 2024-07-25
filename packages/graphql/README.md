# @honohub/graphql

The `useGraphQL` plugin adds the GraphQL endpoint to the Hono App. You can also enable the GraphQL playground using the `playground` prop. {{ className: 'lead' }}

Here's an example of how to use the `useGraphQL` plugin -

```ts
export default defineHub({
  db,
  serverUrl: "http://localhost:3000/",
  collections: [collection],
  plugins: [
    useGraphQL({
      route: "/graphql",
      playground: true,
    }),
  ],
});
```
