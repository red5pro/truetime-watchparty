# WatchParty Project Structure

* Create-React-App
* React-Router-DOM
* Redux? Recoil?
* MaterialUI
* styled-components
* Axios?
* WebSocket (react-use-websocket?)
* Red5 Pro WebRTC SDK [https://www.npmjs.com/package/red5pro-webrtc-sdk](https://www.npmjs.com/package/red5pro-webrtc-sdk)

# Directory Structure

The following directory structure is proposed in order to properly develop, test and maintain the Red5 XDN SaaS site:

```sh
- src
  - api
  - assets
  - atoms (if using recoil)
  - components
    - <ComponentName>
      - <ComponentName>.module.css
      - <ComponentName>.js
      - <ComponentName>.test.js
  - hooks
  - layouts
  - models
  - pages
    - <PageName>
      - <PageName>.css
      - <PageName>.js
      - <PageName>.test.js
  - routes
  - store (if using redux)
  - styles
  - utils
```

* src - the top level directory, in which the index and App files reside. This loose structure was provided from CRA upon scaffolding.
* assets - Any non-code related assets, such as logos and icons that are used site-wide.
* api - Any API related code that pertains to the Accounts API. This could include any GraphQL macros or other Proxy/Decorator utilities, as well as Stream Manager specific requests and configurations.
* atoms - If utilizing the Recoil, this directory holds the specified application state(s). Specified state is referred to as an atom in Recoil.
* components - In the attempt to ease in development and maintenance of the site, Pages will be comprised of N-amount of Components. This directory will hold the Components that make up a Page and each component will reside in its own directory of which it is named. Additionally, each Component directory will house:
    * *.module.css - CSS Module to style the component. Using modules affords not overwriting any classes declared in higher up elements, such as in Page CSS files.
    * *.js - The Component JSX.
    * *.test.js - Any associated tests for the Component.
* hooks - Any custom hooks required. Read more about React Hooks.
* layouts - Any HOC Layouts in JSX. Layouts may provide things such as: an ever present menu bar, account info that is cross-site once logged in, etc.
* models - Any important global wide models or enums.
* pages - A Page represents the full page delivered at a routing endpoint. It is comprised of N-number of Component(s). Similar to how the components directory is structured, accompanying stories and tests will be included for each Page with its own named directory.
* routes - the rout manifest index
* store - If utilizing Redux as state management, this directory will hold the common Redux directory structure with actions and reducers.
* styles - any commonly shared global styles; typically were CSS vars can be stored for ease in switching of thematic colors and styles
* utils - Any utility function that can be used across multiple pages and components.

---

# Notes & Examples

## Red5Pro & React

Example of basic publisher and subscriber in a single component:

[https://gist.github.com/bustardcelly/af4495b7bcbb982a2dd7b9c96c40efee](https://gist.github.com/bustardcelly/af4495b7bcbb982a2dd7b9c96c40efee)

