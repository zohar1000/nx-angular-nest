A base project using angular and nest in a nx workspace.

The project contains a sample app.

Angular version 10.0.11 and nest version 7.4.2.

<br/>

#### Angular optimization:
running without zone.js cannot be done because the themes needs it (material, bootstrap, etc).
using ngZoneEventCoalescing to reduce change detection cycles
OnPush strategy is used except in components having <router-outlet>, from some reason the navigation does not happen with OnPush.

#### Server:
configuration is made by using json5 file which enables comments

#### Serving
serve the server: nx serve api<br/>
serve the app: nx serve sample-app (or just: nx serve)

#### Building
for prod: nx build \<project\> --prod



# About Nx Workspace

This project was generated using [Nx](https://nx.dev).

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

Run `nx dep-graph` to see a diagram of the dependencies of your projects.
