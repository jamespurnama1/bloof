import { defineArrayMember, defineField, defineType } from 'sanity'

const image = (name: string, title: string) => defineField({
  name,
  title,
  type: 'image',
  options: { hotspot: true },
  fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string' })],
})

const imageList = (name: string, title: string) => defineField({
  name,
  title,
  description: 'Drag and drop multiple image files here to upload them together.',
  type: 'array',
  options: { layout: 'grid' },
  of: [defineArrayMember({
    type: 'image',
    options: { hotspot: true },
    fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string' })],
    preview: {
      select: { title: 'alt', media: 'asset' },
      prepare: ({ title, media }) => ({ title: title || 'Untitled image', media }),
    },
  })],
})

const legacyText = (name: string, title: string) => defineField({
  name,
  title,
  type: 'text',
  hidden: true,
})

const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bulleted', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strikethrough', value: 'strike-through' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [defineField({ name: 'href', title: 'URL', type: 'url', validation: rule => rule.required() })],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string' })],
    }),
  ],
})

export const schemaTypes = [
  richText,
  defineType({
    name: 'siteSettings',
    title: 'Site settings',
    type: 'document',
    fields: [
      image('heroImage', 'Hero image'),
      defineField({
        name: 'socials',
        title: 'Social links',
        type: 'array',
        of: [defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string', validation: rule => rule.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: rule => rule.required() }),
          ],
        })],
      }),
      defineField({
        name: 'featuredHappening',
        title: 'Featured happening',
        type: 'reference',
        to: [{ type: 'happening' }],
      }),
      defineField({
        name: 'location',
        title: 'Location',
        type: 'object',
        fields: [
          defineField({ name: 'address', type: 'string' }),
          defineField({ name: 'lat', title: 'Latitude', type: 'number' }),
          defineField({ name: 'lng', title: 'Longitude', type: 'number' }),
        ],
      }),
      defineField({
        name: 'privateRooms',
        title: 'Private rooms',
        type: 'object',
        fields: [image('bloofBelly', 'Bloof Belly'), image('bloofEye', 'Bloof Eye')],
      }),
      legacyText('regulation', 'Legacy reservation regulation'),
      defineField({ name: 'regulationRich', title: 'Reservation regulation', type: 'richText' }),
    ],
    preview: { prepare: () => ({ title: 'Site settings' }) },
  }),
  defineType({
    name: 'eventsPage',
    title: 'Events page',
    type: 'document',
    fields: [
      legacyText('description', 'Legacy description'),
      defineField({ name: 'descriptionRich', title: 'Description', type: 'richText' }),
      imageList('brochures', 'Brochures'),
      defineField({ name: 'callToAction', title: 'Call to action', type: 'string' }),
      legacyText('moreDescription', 'Legacy more description'),
      defineField({ name: 'moreDescriptionRich', title: 'More description', type: 'richText' }),
    ],
  }),
  defineType({
    name: 'menuPage',
    title: 'Menu page',
    type: 'document',
    fields: [
      defineField({ name: 'subhead', type: 'string' }),
      image('coverImage', 'Cover image'),
      defineField({
        name: 'menuPdf',
        title: 'Menu PDF',
        type: 'file',
        options: { accept: 'application/pdf' },
      }),
      imageList('foodPages', 'Food menu pages'),
      imageList('drinkPages', 'Drink menu pages'),
      imageList('breakfastPages', 'Breakfast menu pages'),
    ],
  }),
  defineType({
    name: 'galleryPage',
    title: 'Gallery page',
    type: 'document',
    fields: [imageList('images', 'Gallery images')],
    preview: {
      select: { images: 'images' },
      prepare: ({ images }) => ({
        title: 'Gallery page',
        subtitle: `${images?.length ?? 0} images`,
      }),
    },
  }),
  defineType({
    name: 'happening',
    title: 'Happening',
    type: 'document',
    fields: [
      defineField({ name: 'title', type: 'string', validation: rule => rule.required() }),
      defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: rule => rule.required() }),
      defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime' }),
      defineField({
        name: 'category',
        type: 'string',
        options: {
          list: [
            { title: 'Ongoing', value: 'ongoing' },
            { title: 'Upcoming', value: 'upcoming' },
            { title: 'Happy Hours', value: 'happy_hours' },
            { title: 'Collaborations', value: 'collaborations' },
          ],
          layout: 'radio',
        },
        validation: rule => rule.required(),
      }),
      image('thumbnail', 'Thumbnail'),
      legacyText('body', 'Legacy post content'),
      defineField({ name: 'bodyRich', title: 'Post content', type: 'richText' }),
    ],
  }),
]