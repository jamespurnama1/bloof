
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import { createClient } from '@sanity/client'

export default defineSitemapEventHandler(async () => {
  const projectId = process.env.SANITY_PROJECT_ID
  if (!projectId) return []

  const client = createClient({
    projectId,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2026-10-24',
    useCdn: true,
  })
  const slugs = await client.fetch<string[]>(`*[_type == "happening" && defined(slug.current)].slug.current`)

  return slugs.map(slug => asSitemapUrl({ loc: `happenings/${slug}` }))
})
