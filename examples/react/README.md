# Example React App

This is an example of a React app that demonstrates using MAJC for serving ads to a [Pocket](https://getpocket.com/explore/item/what-the-best-mentors-do)-like article. This utilizes the `MozAdsPlacement` component to add placements to the page. See `./components/article/Article.tsx` and `./components/navbar/SideBar.tsx` for usage details.

## Running locally

From the `examples/react` folder:

```
npm install
npm run dev
```

Or, from the root of the parent MAJC repo:

```
npm install
npm run example:react
```

## Linting

This example React app is linted using `eslint`. To run the linter:

```
npm run lint
```

Or, to fix issues that can be automatically resolved:

```
npm run lint:fix
```
