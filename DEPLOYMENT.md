# 🚀 Deployment Guide

This guide covers how to deploy your **Backend** to Render and build your **Mobile App (APK)** to connect to it.

## 1. Deploy the Backend to Render

1.  Push your code to **GitHub**.
2.  Log in to [Render](https://dashboard.render.com).
3.  Click **New +** and select **Blueprint**.
4.  Connect your GitHub repository.
5.  Render will find the `render.yaml` file and automatically configure the **task-master-api** service.
6.  **Crucial Step**: In the Render dashboard for your service, go to **Environment** and add:
    -   `DATABASE_URL`: (Paste your Neon PostgreSQL connection string here).
7.  Once deployed, Render will give you a URL like `https://task-master-api.onrender.com`. **Copy this URL.**

---

## 2. Prepare for APK Build (EAS Build)

To build a professional APK that connects to your new Render backend, follow these steps:

### A. Install EAS CLI
In your local terminal, run:
```bash
npm install -g eas-cli
```

### B. Configure the API URL
You must tell the app to use the Render URL instead of `localhost`. 
1. Open `artifacts/todo-app/.env`.
2. Update the `EXPO_PUBLIC_API_URL` to your Render URL:
   ```env
   EXPO_PUBLIC_API_URL=https://task-master-api.onrender.com
   ```

### C. Build the APK
Navigate to the frontend folder and run the build command:
```bash
cd artifacts/todo-app
eas build --platform android --profile preview
```
*Note: The `--profile preview` will generate a downloadable `.apk` file instead of an `.aab` for the Play Store.*

---

## 3. Testing
1.  Verify the backend is live by visiting `https://your-api-url.onrender.com/api/tasks` in your browser.
2.  Install the generated APK on your phone.
3.  The app will now connect to the cloud database regardless of what network you are on!
