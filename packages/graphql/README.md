# Hono Hub GraphQL Plugin

## Usage

```ts
defineApp({
  db,
  collections: [],
  plugins: [
    useGraphql({
      route: "/custom-route", // Default `/graphql`
    }),
  ],
});
```
