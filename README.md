# Spotify Artists Module

A Next.js app that displays Spotify artists.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Get Spotify API credentials from https://developer.spotify.com/dashboard

3. Create `.env.local` with your credentials using the `.env.example` as a template.

4. Run the dev server:
```bash
npm run dev
```

### Production

1. Build the app:
```bash
npm run build
```
2. Start the app:
```bash
npm start
```

## Usage

- Login with default username: `admin` and password: `password`
- Go to `/admin` to add artist IDs
- Artist IDs can be found in Spotify URLs (e.g., Steve Miller Band: `6QtGlUje9TIkLrgPZrESuk`)
- Max 20 artists


## Future Improvements

- Improve UI (ideally using library like ant design)
- Use a database for storing artists instead of json file
- Add tests
- Add more robust error handling
- Stricter TypeScript types
- Improve loading state
- User creation and management (password hashing, etc.)