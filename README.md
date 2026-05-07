# Run and deploy your AI Studio app

![GHBanner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

This contains everything you need to run your app locally.

View your app in AI Studio: [open in AI Studio](https://ai.studio/apps/drive/19leIl_NfW_XwW4TpZ7j_ClQ7ycNzVxGH)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

If the backend API is not available locally, the UI will fall back to mock analysis so you can still preview the app.

## Deploy Publicly With Full AI Features

Deploy this project to Vercel so the browser can call a serverless API route without exposing your API key.

1. Push this repository to GitHub.
2. Open Vercel and import the repository as a new project.
3. Add an environment variable in Vercel:
   `SILICONFLOW_API_KEY=<your_siliconflow_key>`
4. Keep the build settings as:
   `npm run build`
   output directory: `dist`
5. Deploy the project.

After deployment, public users will access the full analysis flow through `/api/analyze`.
