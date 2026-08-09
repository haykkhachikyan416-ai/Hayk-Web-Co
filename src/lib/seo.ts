import { site } from '../content/site'

export const absoluteUrl = (path: string) => new URL(path, site.siteUrl).toString()

export const pageTitle = (title?: string) =>
  title ? `${title} | ${site.name}` : `${site.name} | Websites for Local Businesses`
