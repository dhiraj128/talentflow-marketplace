# Google OAuth Production Setup Guide

To complete the Google OAuth integration on production, you must obtain a Google Client ID and Secret and configure them in Render. 

This guide details the exact steps required.

---

## 1. Google Cloud Console Steps

1. Navigate to the [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project (or select your existing project).
3. Open the **Navigation Menu** and go to **APIs & Services > OAuth consent screen**.

## 2. OAuth Consent Screen

1. Choose **External** user type and click Create.
2. Fill out the application details:
   - **App name**: TalentFlow
   - **User support email**: Your email
   - **Developer contact info**: Your email
3. Click **Save and Continue**.
4. You do not need to add any specific scopes for now, just the default email/profile are requested by the strategy. Click **Save and Continue**.
5. Under **Test users**, click **Save and Continue**.
6. At the summary page, click **Back to Dashboard**.
7. *(Crucial)*: Click **PUBLISH APP** to push the OAuth consent screen to production so any Google user can log in.

## 3. Create OAuth Client

1. Navigate to **APIs & Services > Credentials**.
2. Click **+ CREATE CREDENTIALS** and select **OAuth client ID**.
3. Choose **Web application** as the Application type.
4. Name it "TalentFlow Production".

## 4. Authorized JavaScript Origins

Under **Authorized JavaScript origins**, click **ADD URI** and enter:
```
https://talentflow-marketplace.vercel.app
```

## 5. Authorized Redirect URI

Under **Authorized redirect URIs**, click **ADD URI** and enter exactly:
```
https://talentflow-backend-qn7b.onrender.com/api/v1/auth/google/callback
```
*Note: Ensure there is no trailing slash.*

Click **CREATE**.

## 6. Required Render Environment Variables

You will be presented with your **Client ID** and **Client Secret**.

Go to your [Render Dashboard](https://dashboard.render.com), select your backend service (`talentflow-backend`), and navigate to the **Environment** tab.

Add the following three variables:

- **Key**: `GOOGLE_CLIENT_ID`
- **Value**: *(Paste the Client ID from Google)*

- **Key**: `GOOGLE_CLIENT_SECRET`
- **Value**: *(Paste the Client Secret from Google)*

- **Key**: `GOOGLE_CALLBACK_URL`
- **Value**: `https://talentflow-backend-qn7b.onrender.com/api/v1/auth/google/callback`

Click **Save Changes**. Render will automatically restart your backend service.

## 7. Local .env Configuration

For testing OAuth locally, copy the `.env.example` in `talentflow-backend` to `.env` and fill in the same credentials, except change the `GOOGLE_CALLBACK_URL` to `http://localhost:3000/api/v1/auth/google/callback`. Remember to also add `http://localhost:3000` to the Authorized Redirect URIs in Google Cloud if you intend to test locally.

## 8. Troubleshooting Guide

- **401 invalid_client**: The `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` in Render is missing or incorrect.
- **redirect_uri_mismatch**: The `GOOGLE_CALLBACK_URL` provided to the backend does not exactly match the "Authorized redirect URI" in Google Cloud Console.
- **access_denied**: The user clicked "Cancel" when asked to grant permissions.
- **invalid_request**: Malformed request or scopes.
