# Hono Hub

A CMS framework using Hono + Drizzle + Zod.

## Install

```sh
# Using npm/yarn/pnpm/bun
npm add honohub
```

## TODOs

- [x] REST API `honohub`
- [x] GraphQL Plugin `@honohub/graphql`
- [x] Hooks Support
- [ ] File Storage
- [ ] Dashboard Plugin

## Endpoints

#### List Records - `GET /{slug}`

Get all the records in the database. If you have enable `pagination` you can also query data with `limit` and `offset`. Sorting is also available.

#### Create Records - `POST /{slug}`

Create a new record. You can pass the data as `json` or `formData`. It should be valid data as it will be validated by `zod`.

#### Bulk Create Records - `POST /{slug}`

You can also bulk create data, just pass data in an array.

#### Retrieve Records - `GET /{slug}/{id}`

Retrieve the record with the given `id`

#### Update Records - `PATCH /{slug}/{id}`

Update the record with the given `id`. You can pass the data as `json` or `formData`. It should be valid data as it will be validated by `zod`.

#### Delete Records - `DELETE /{slug}/{id}`

Delete the record with the given `id`.
