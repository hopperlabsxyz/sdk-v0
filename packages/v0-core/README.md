# v0-core SDK

## How to install

First, create a github token with read packages permissions and export it to your env variables

```bash
export NODE_AUTH_TOKEN='your github token'
```

Then add a `.npmrc` file to your project whith the following infos:

```bash
@hopperlabsxyz:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Now you can install the library

```
npm install @hopperlabsxyz/v0-core:latest
```

## Local development:

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
