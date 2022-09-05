# Watch Party - React Signle-Page-Application (SPA)

---

# Installation

After pulling down this repo and prior to issuing a build command of the app, you must fist issue the following command to insall all dependnecies:

```sh
npm install
```

# Deployment of WatchParty SPA

The deployment of the React Single-Page-Application (SPA) requires to first create a bundled build of the site. The endpoints used in the app are compiled in based on environment variables. These environments are held in files labelled `.env*`.

There are 2 different `.env*` files used to build the app:

* `.env` - the default environment to build the app for internal testing.
* `.env-demo` - an environment pointing to the remote endpoints used for the demo in Europe.

> You can find these environment files in Confluence at: [https://infrared5.atlassian.net/wiki/spaces/CUS/pages/2730262628/Watchparty+Deployments](https://infrared5.atlassian.net/wiki/spaces/CUS/pages/2730262628/Watchparty+Deployments).

For internal testing, the app can be built pointing to `.env` file using the following command:

```sh
npm build
```

To make a build for demo purposes - of which the endpoints point to servers deployed in Germany - use the following command to compile against the `.env-demo` environment:

```sh
npm build:demo
```

This will produce deployment files in a `build` directory of the root of this repository. All the files produced from the `build` need to be deployed to a remote location.

By convention all the files from within the `build` directory can be deployed to a remote server within a directory on the remote server setup to define the root of a site; for the purposes of this documentation, that will be `/var/www/red5-watchparty`.

Additionally, on the remote server hosting the deploy files, `nginx` will be setup to:

1. Point all requests to the `/var/www/red5-watchparty` directory as the root site.
2. Have rule(s) that specify that any requests are redirected to `index.html` from the root of the site files.

I think the rule would be something like:

```
location / {
  try_files $uri /index.html;
}
```

The reason that we need to route all page requests to `index.html` is because the React app is a Single-Page-Application (SPA) that has internal routing. As such, all page routes are really accessed through the index file.

Basic example of nginx conf:

```
server {
   listen 80;
   server_name red5-watchparty.red5.net;
   root /var/www/red5-watchparty;
   index index.html;
   location / {
   try_files $uri /index.html;
   }
}
