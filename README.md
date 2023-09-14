<h3 align="center">
  <img src="assets/Red5_Truetime_black.png" alt="Red5 TrueTime" style="height: 60px" />
</h3>

# Red5 TrueTime WatchParty

![Red5 TrueTime WatchParty](docs/watchparty-vod.png)

[See it in action!](https://www.youtube.com/watch?v=EhleTDPz-B8&list=TLGGpEZCWusB0F4yODExMjAyMg)

This repository contains code for the React-based client-side Red5 TrueTime WatchParty web application.

## Solutions

There are two solutions that the TrueTime WatchParty client provides:

* [WatchParty for Fans](https://www.red5.net/truetime/watchparty-for-fans/)
* [Studio for Webinars](https://www.red5.net/truetime/studio-for-webinars/)

When building and deploying your own solution, you can define which solution to use by setting the `REACT_APP_WEBAPP_MODE` environment variable to either `watchparty` or `webinar`, respectively. More information about environment variables available is in the following section.

# Requirements

## Client Side

The Watch Party web application has a few environment configuration details required to build and properly run. You can view the required variables in the [.env.example](.env.example) file.

It is recommended to make a copy of the [.env.example](.env.example) file, rename to `.env.development.local` (or other desired naming convention) and update these variables with their respective values for your own version of this product.

The variables are:

* `REACT_APP_VERSION` - The version of the product that will be printed in the dev console of the browser.
* `REACT_APP_SM` - Flag to utilize the `Stream Manager` capabilities of the Red5 Pro Server. Set to `1` for `true`.
* `REACT_APP_PREFER_WHIP_WHEP` - Flag to utilize WHIP/WHEP for establishing stream connections. Set to `1` for `true`.
* `REACT_APP_API_SERVER_HOST` - The endpoint base URL for the `Conference API`. (**Coming Soon**)
* `REACT_APP_SERVER_HOST` - The endpoint base URL fro the Red5 Pro Streaming Server.
* `REACT_APP_PUBLISH_API_KEY` - The publish API key for [PubNub](https://www.pubnub.com/) chat integration.
* `REACT_APP_SUBSCRIBE_API_KEY` - The subscribe API key for [PubNub](https://www.pubnub.com/) chat integration.
* `REACT_APP_RECAPTCHA_SITE_KEY` - The public key for [Recaptcha](https://developers.google.com/recaptcha/) integration.
* `REACT_APP_RECAPTCHA_SECRET_KEY` - The private key for [Recaptcha](https://developers.google.com/recaptcha/) integration.
* `REACT_APP_FACEBOOK_APP_ID` - The Facebook ID for Facebook Log In integration.
* `REACT_APP_WEBAPP_MODE` - The "mode" to launch the app in. By default, the mode is `watchparty`. The other available mode is `webinar`, which provides an interface more akin to conferences.

> See [Get Started](#get-started) for further instruction on build and run.

## Server Side

The TrueTime WatchParty web application utilizes [Red5 Pro Server](https://www.red5pro.com/) for streaming sub-second live video of all party participants and main video feed(s).

Additionally, the Red5 TrueTime WatchParty application requires communication with the **upcoming** release of the `Conference API` for the [Red5 Pro Server](https://www.red5pro.com/).

# Getting Started with Red5 TrueTime WatchParty

### `git clone git@github.com:red5pro/red5pro-watch-party.git`

## Get started

### `npm install`

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run start`

Runs the app in the development mode.\
Open [https://localhost:3006](https://localhost:3006) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.


See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

# Conference API

The TrueTime WatchParty utilizes the Conference API distributed with the Red5 Pro Server.

We have provided a [Postman Collection](docs/conferenceapi/Conference_API.postman_collection.json) that details the API.

# Deployment

Please refer to the [Deployment Instructions](DEPLOYMENT.md) on requirement for deployment.

# Structure

Please refer to the [Structure Documentation](STRUCTURE.md) that details the structure of this repo and the technologies/libraries used.
