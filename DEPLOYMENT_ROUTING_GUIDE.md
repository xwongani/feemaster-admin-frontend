# Deployment Routing Guide

This guide explains how to handle client-side routing issues when deploying the FeeMaster Admin Frontend.

## The Problem

When using React Router with `BrowserRouter`, direct access to routes like `/admin/dashboard` or page reloads on these routes will result in a 404 error because the server tries to find a file at that path instead of serving the `index.html` file.

## Solutions by Hosting Platform

### 1. Netlify
The `public/_redirects` file is already configured:
```
/*    /index.html   200
```

### 2. Vercel
The `vercel.json` file is already configured:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Apache Server
The `public/.htaccess` file is already configured:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### 4. IIS Server
The `public/web.config` file is already configured:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### 5. Nginx
Add this to your nginx configuration:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 6. Express.js (Node.js)
If serving with Express.js, add this middleware:
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

## Alternative: HashRouter

If you can't configure the server or are still having issues, you can switch to HashRouter:

1. Update `src/App.tsx`:
```javascript
// Change this line:
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// To this:
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
```

2. Rebuild and deploy:
```bash
npm run build
```

**Note:** HashRouter will change your URLs from `/admin/dashboard` to `/#/admin/dashboard`, but it will work without server configuration.

## Testing

After deployment, test these scenarios:
1. Direct access to `/admin/dashboard`
2. Direct access to `/parent/dashboard`
3. Reloading the page on any route
4. Using browser back/forward buttons

All should work without 404 errors.

## Troubleshooting

If you're still having issues:

1. **Check your hosting platform's documentation** for specific routing configuration
2. **Verify the configuration files** are in the correct location (usually in the `public` folder)
3. **Clear browser cache** and try again
4. **Check browser console** for any errors
5. **Consider using HashRouter** as a temporary solution

## Platform-Specific Notes

- **Netlify**: The `_redirects` file should be in the `public` folder
- **Vercel**: The `vercel.json` file should be in the root directory
- **GitHub Pages**: Consider using HashRouter as GitHub Pages doesn't support custom server configurations
- **Firebase Hosting**: Add a `firebase.json` file with proper rewrites configuration 