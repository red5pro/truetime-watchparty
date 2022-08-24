# Deployment of WatchParty SPA

The deployment of the React Single-Page-Application (SPA) requires to first create a bundled build of the site:

```sh
npm install
npm build
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
