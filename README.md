# MAJC

## Overview

MAJC is a small, reusable JavaScript component that requests and displays ads from Mozilla’s servers. It is designed for use on HTML surfaces that display sponsored content, like Mozilla web properties or the Firefox New Tab page.

MAJC is privacy-first. It does not track users nor store cookies. It does not send sensitive identifiable information to Mozilla. Of the information Mozilla does receive, anything shared with advertisers is aggregated and/or de-identified to preserve user privacy.

MAJC can request and display standard ad placements, and calls the appropriate callback URLs to send anonymized impressions and clicks back to Mozilla. MAJC also provides a facility to report user dissatisfaction with ads so we can take appropriate action as necessary.

While we welcome outside feedback and are committed to open source, this library is intended solely for use on Mozilla properties.

## Code of Conduct

This project and repository is governed by Mozilla's code of conduct and etiquette guidelines. Please see the [CODE_OF_CONDUCT.md](https://github.com/mozilla-services/majc/blob/main/.github/CODE_OF_CONDUCT.md) file for more details.

## License

This repository is licensed under MPL-2.0. Please see the [LICENSE](https://github.com/mozilla-services/majc/blob/main/.github/LICENSE) file for more details.

## Documentation

### Installing this package

In your project's repository:

```sh
npm install --save git+https://github.com/mozilla-services/majc.git
```

Or, add this repository's Git URL to your project's dependencies in `package.json`:

```json
"dependencies": {
  "@mozilla-services/majc": "git+https://github.com/mozilla-services/majc.git"
}
```

### Importing this package

Depending on your project's setup, this package may be included in several different ways.

#### [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)

For webpages that want to simply include a `<script>` tag:

```html
<script src="iife.global.js"></script>
```

The `iife.global.js` bundle may be found in this repo's `./dist` folder. This bundle exposes a single `mozAds` global containing the `renderPlacement` function as well as some useful constants such as standard IAB placement size definitions. Please see the example in `./examples/iife` for usage.

#### React

React apps can import the `react` bundle from this repo's `./dist` folder. This bundle is available in both CJS and ESM formats and also includes TypeScript type definitions. The primary export from this bundle is the `MozAdsPlacement` component. To import in a TypeScript React app:

```ts
import { MozAdsPlacement } from '@mozilla-services/majc/dist/react'
```

This bundle exports a React component and hooks for inclusion in a React app. Please see the example in `./examples/react` for usage.

##### A Note on SSR

Due to the use of certain hooks, `useState`, `useEffect`, etc., our React component requires that instances are rendered client-side and not server-side. However, this behavior should be handled automatically by the library as all React components are annotated during the build process with a top-level `"use client"` directive. As a result, applications implementing SSR should not need to take any additional steps when using these React components and they should work "out of the box".
