/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ExploreVenuesImport } from './routes/explore-venues'
import { Route as IndexImport } from './routes/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'

// Create Virtual Routes

const AboutLazyImport = createFileRoute('/about')()

// Create/Update Routes

const AboutLazyRoute = AboutLazyImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const ExploreVenuesRoute = ExploreVenuesImport.update({
  id: '/explore-venues',
  path: '/explore-venues',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  id: '/dashboard/',
  path: '/dashboard/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/explore-venues': {
      id: '/explore-venues'
      path: '/explore-venues'
      fullPath: '/explore-venues'
      preLoaderRoute: typeof ExploreVenuesImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/explore-venues': typeof ExploreVenuesRoute
  '/about': typeof AboutLazyRoute
  '/dashboard': typeof DashboardIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/explore-venues': typeof ExploreVenuesRoute
  '/about': typeof AboutLazyRoute
  '/dashboard': typeof DashboardIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/explore-venues': typeof ExploreVenuesRoute
  '/about': typeof AboutLazyRoute
  '/dashboard/': typeof DashboardIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/explore-venues' | '/about' | '/dashboard'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/explore-venues' | '/about' | '/dashboard'
  id: '__root__' | '/' | '/explore-venues' | '/about' | '/dashboard/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ExploreVenuesRoute: typeof ExploreVenuesRoute
  AboutLazyRoute: typeof AboutLazyRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ExploreVenuesRoute: ExploreVenuesRoute,
  AboutLazyRoute: AboutLazyRoute,
  DashboardIndexRoute: DashboardIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/explore-venues",
        "/about",
        "/dashboard/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/explore-venues": {
      "filePath": "explore-venues.tsx"
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
