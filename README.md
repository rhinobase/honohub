# Hono Hub

A CMS framework using Hono + Drizzle + Zod.

**HonoX** is a simple and fast meta-framework for creating full-stack websites or Web APIs - (formerly _[Sonik](https://github.com/sonikjs/sonik)_). It stands on the shoulders of giants; built on [Hono](https://hono.dev/), [Vite](https://vitejs.dev/), and UI libraries.

**Note**: _HonoX is currently in the "alpha stage". Breaking changes are introduced without following semantic versioning._

## Features

- **File-based routing** - You can create a large application like Next.js.
- **Fast SSR** - Rendering is ultra-fast thanks to Hono.
- **BYOR** - You can bring your own renderer, not only one using hono/jsx.
- **Islands hydration** - If you want interactions, create an island. JavaScript is hydrated only for it.
- **Middleware** - It works as Hono, so you can use a lot of Hono's middleware.

## Install

```sh
# Using npm/yarn/pnpm/bun
npm add honohub
```

## TODOs

- [x] REST API `honohub`
- [x] GraphQL Plugin `@honohub/graphql`
- [x] Hooks Support
- [x] Search Support
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
