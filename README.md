# Hono Hub

A CMS framework using Hono + Drizzle + Zod + Vite.

**HonoHub** is a simple and fast meta-framework for creating CMS for your websites or Apps. It stands on the shoulders of giants; built on [Hono](https://hono.dev/), [Drizzle](https://orm.drizzle.team/), [Zod](https://zod.dev/), and [Vite](https://vitejs.dev/).

**Note**: _HonoHub is currently in the "alpha stage". Breaking changes are introduced without following semantic versioning._

## Features

- **REST API** - `honohub` provides a powerful and flexible REST API for your applications.
- **GraphQL Plugin** - Utilize the `@honohub/graphql` plugin for seamless GraphQL integration.
- **Hooks Support** - Incorporate hooks to manage and extend your application's functionality.
- **Panel Plugin** - Integrate customizable UI components and panels to enhance your application's user interface and overall experience.

## Coming Soon

- **Search Support** - Future implementation to enable efficient search capabilities.
- **File Storage** - Upcoming feature for robust file storage solutions.

## Install

```sh
# Using npm/yarn/pnpm/bun
npm add honohub
```

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

## Credits

The `honohub` project's UI is inspired by [Nuxt Devtools](https://github.com/nuxt/devtools).
