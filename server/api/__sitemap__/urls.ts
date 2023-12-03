
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'

export default defineSitemapEventHandler(async () => {
  const data = await $fetch(`https://api.cosmicjs.com/v3/buckets/bloof-production/objects?pretty=true&query=%7B%22type%22:%22happenings%22%7D&read_key=${process.env.COSMIC_READ_KEY}&depth=1&props=slug,title,metadata,`) as happeningsData;

  return [
    ...data.objects.map((x) => asSitemapUrl({
      loc: `happenings/${x.slug}`,
    }))
  ]
})
