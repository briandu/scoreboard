Simple live scoreboard using Next.js (App Router) + Firebase Realtime Database.

## Local setup

1. Create a Firebase project, enable Realtime Database (in test mode for quick start), and copy Web app config.
2. Create `.env.local` in the project root with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

3. Install deps and run:

```
npm install
npm run dev
```

Open http://localhost:3000

## Usage

- Control scores: `/scoreboard` (adjust Home/Away, Reset)
- View-only scoreboard: `/view/default` (or `/view/{gameId}`)
- Multiple games supported by visiting different view URLs.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Create a new Vercel project and import the repo.
3. In Vercel Project Settings → Environment Variables, add the same `NEXT_PUBLIC_FIREBASE_*` values as above.
4. Deploy. Your control page will be at `/scoreboard`, viewer at `/view/{gameId}`.

## Notes

- Realtime sync is powered by Firebase RTDB listeners, so changes from the control page instantly reflect on the viewer.
- You can secure write access by adding RTDB rules to require auth; for quick demos, test mode is fine but not for production.
