// prefer default export if available
const preferDefault = m => (m && m.default) || m

exports.components = {
  "component---node-modules-gatsby-plugin-offline-app-shell-js": () => import("./../../../node_modules/gatsby-plugin-offline/app-shell.js" /* webpackChunkName: "component---node-modules-gatsby-plugin-offline-app-shell-js" */),
  "component---src-pages-404-tsx": () => import("./../../../src/pages/404.tsx" /* webpackChunkName: "component---src-pages-404-tsx" */),
  "component---src-pages-index-tsx": () => import("./../../../src/pages/index.tsx" /* webpackChunkName: "component---src-pages-index-tsx" */),
  "component---src-templates-categories-tsx": () => import("./../../../src/templates/categories.tsx" /* webpackChunkName: "component---src-templates-categories-tsx" */),
  "component---src-templates-post-tsx": () => import("./../../../src/templates/post.tsx" /* webpackChunkName: "component---src-templates-post-tsx" */)
}

