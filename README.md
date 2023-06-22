# MyRoutes.Front

## Translations

- [ES Español](./README.es.md)

This is the Vue.js Application of MyRoutes project.

## Project requirements

**Note**: It works with `Node JS` version **16**, but not with version 18.

## Project Setup

### Dependency installation
This install all necesary packages.
```sh
npm install
```

### Environment configuration
We have to configure the environment file. We can see an example in the file ```.env.example```. 
```conf
# Environment file example

# Auth API
VITE_AUTH_BASE_URL=http://localhost:3000/auth

# User API
VITE_USER_BASE_URL=http://localhost:3000/user

# File API
VITE_FILE_BASE_URL=http://localhost:3000/file

# Track API
VITE_TRACK_BASE_URL=http://localhost:3000/track

# Configuration API
VITE_CONFIGURATION_BASE_URL=http://localhost:3000/Configuration

# MapBox Access token
# See: https://docs.mapbox.com/help/getting-started/access-tokens/
VITE_MAPBOX_ACCESS_TOKEN=Here_goes_your_MapBox_access_token

# Encryptation password
VITE_ENCRYPTATION_PASSWORD=Here_goes_your_encryptation_password
```
For local use in development mode the file will be named as `.env.local`.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).
