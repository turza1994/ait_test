# Postman Collection Setup Guide

## 📦 Files Created

- `Node Express API.postman_collection.json` - Complete API collection
- `Node Express API.postman_environment.json` - Environment configuration

## 🚀 Quick Setup

### 1. Import Collection & Environment

1. Open Postman
2. Click **Import** → Select `Node Express API.postman_collection.json`
3. Click **Import** again → Select `Node Express API.postman_environment.json`
4. Select the imported environment from the dropdown (top-right)

### 2. Start the Server

```bash
npm run dev
```

Server should run on `http://localhost:5000`

## 🔐 Authentication Flow

### Step 1: Create Account

1. Expand **Authentication** folder
2. Send `POST /api/auth/signup`
3. Request body (pre-filled):
   ```json
   {
     "email": "testuser@example.com",
     "password": "Password123!@#",
     "name": "Test User"
   }
   ```

### Step 2: Login

1. Send `POST /api/auth/login`
2. Request body (pre-filled):
   ```json
   {
     "email": "testuser@example.com",
     "password": "Password123!@#"
   }
   ```
3. **Auto-magic**: Access token and CSRF token saved automatically

### Step 3: Access Protected Endpoints

All subsequent requests will automatically use the saved access token.

## 📚 Available Endpoints

### Health Check

- `GET /api/health` - Check API status (no auth required)

### Authentication

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login (saves tokens)
- `POST /api/auth/refresh-token` - Refresh access token (requires CSRF)
- `POST /api/auth/logout` - User logout (clears cookies)

### Sample API (Requires Auth)

- `GET /api/sample/items/{userId}` - Get user's sample item
- `PUT /api/sample/items/{userId}` - Update sample item
- `PUT /api/sample/items/{userId}/lock` - Update with optimistic locking

## 🔧 Advanced Features

### Automatic Token Refresh

The collection includes pre-request scripts that automatically refresh expired access tokens when making authenticated requests.

### CSRF Protection

- CSRF tokens are automatically extracted from response headers
- Required for refresh-token requests
- Managed automatically by the collection

### Cookie Management

Postman automatically handles HTTP-only refresh token cookies. Ensure:

- Settings → General → **Send cookies with requests** is ON
- Settings → General → **Store cookies for APIs** is ON

## 🧪 Testing Guide

### Basic Flow Test

1. **Health Check** → Should return `{ success: true, data: { status: 'ok' } }`
2. **Signup** → Should create user and return access token
3. **Login** → Should return new access token and set cookies
4. **Get Sample Item** → Should return user data
5. **Update Sample Item** → Should update and return modified data
6. **Logout** → Should clear cookies and return success

### Error Scenarios

- Try accessing protected endpoints without authentication
- Use wrong credentials in login
- Test CSRF token validation
- Test optimistic locking with wrong version

## 🐛 Troubleshooting

### Common Issues

**"Access token expired"**

- Collection auto-refreshes tokens, but if it fails:
- Send `POST /api/auth/login` again

**"CSRF token required"**

- Ensure you've logged in first (login sets CSRF token)
- Check that `{{csrfToken}}` variable is populated

**"401 Unauthorized"**

- Verify environment is selected
- Check that `{{accessToken}}` variable is populated
- Try logging in again

**Cookie Issues**

- Enable cookie sending in Postman settings
- Clear cookies: Postman → Settings → Cookies → Delete all

**Server Connection**

- Verify server is running on port 5000: `npm run dev`
- Check `{{baseUrl}}` is `http://localhost:5000`

### Debug Mode

Enable console logs in Postman:

1. Settings → General → **Show Postman console**
2. View token refresh logs and request details

## 📝 Variable Reference

| Variable      | Purpose               | Auto-Managed |
| ------------- | --------------------- | ------------ |
| `baseUrl`     | API base URL          | No           |
| `accessToken` | JWT Bearer token      | ✅ Yes       |
| `csrfToken`   | CSRF protection token | ✅ Yes       |
| `userId`      | Current user ID       | ✅ Yes       |

## 🎯 Pro Tips

1. **Duplicate Environment**: Create multiple environments for dev/staging/prod
2. **Test Data**: Modify request bodies with different test data
3. **Rate Limiting**: Be mindful of rate limiting when testing
4. **Clean Up**: Use logout endpoint to properly end sessions

## 🚨 Security Notes

- Never commit actual access tokens or credentials
- Use different credentials for testing vs. development
- CSRF tokens protect against cross-site request forgery
- HTTP-only cookies prevent XSS token theft

---

**Happy Testing! 🎉**

The API is fully functional with proper authentication, CSRF protection, and comprehensive error handling. All endpoints are ready for testing.
