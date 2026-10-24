import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'

const singletonTypes = ['siteSettings', 'eventsPage', 'menuPage', 'galleryPage']

export default defineConfig({
  name: 'default',
  title: 'Bloof',
  basePath: '/studio',
  projectId: process.env.SANITY_PROJECT_ID || 'yourProjectId',
  dataset: process.env.SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) => S.list().title('Content').items([
        S.listItem().title('Site settings').id('siteSettings').child(
          S.document().title('Site settings').schemaType('siteSettings').documentId('siteSettings'),
        ),
        S.listItem().title('Events page').id('eventsPage').child(
          S.document().schemaType('eventsPage').documentId('eventsPage'),
        ),
        S.listItem().title('Menu page').id('menuPage').child(
          S.document().schemaType('menuPage').documentId('menuPage'),
        ),
        S.listItem().title('Gallery page').id('galleryPage').child(
          S.document().title('Gallery page').schemaType('galleryPage').documentId('galleryPage'),
        ),
        S.divider(),
        ...S.documentTypeListItems().filter((item) => !singletonTypes.includes(item.getId() || '')),
      ]),
    }),
  ],
  schema: { types: schemaTypes },
})