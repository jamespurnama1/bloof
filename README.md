# Bloof

Nuxt site with Sanity Studio served at `/studio`.

## Setup

Install dependencies and configure the Sanity project:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

Set these values in `.env` (`production` is the default dataset):

```dotenv
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
```

The Studio and frontend use the same values. Add the local and production site origins under API > CORS origins in Sanity Manage, allowing credentials. The first Studio visit will ask you to sign in and authorize the project.

## Development Server

Start the development server on `http://localhost:3000`; open `http://localhost:3000/studio` to edit content:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
