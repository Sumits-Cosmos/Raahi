# User Registration Endpoint Documentation

## Endpoint: `/users/register`

### Description
The `/users/register` endpoint is used to register a new user in the application. It accepts user details and creates a new user account.

### Required Data
The following data is required in the request body for successful registration:

- **email**: A valid email address of the user.
- **fullName**: An object containing the user's full name.
  - **firstName**: The first name of the user (minimum 3 characters).
- **password**: A password for the user account (minimum 6 characters).

### Request Example
```json
{
  "email": "user@example.com",
  "fullName": {
    "firstName": "John"
  },
  "password": "securepassword"
}
```

### Possible Status Codes
- **201 Created**: The user has been successfully registered.
- **400 Bad Request**: The request data is invalid or missing required fields.
- **409 Conflict**: The email address is already in use.

### Notes
Ensure that the request body is sent in JSON format and that all required fields are included to avoid errors during registration.


# User Authentication Endpoints Documentation

## Endpoint: `/users/register`

### Description
The `/users/register` endpoint is used to register a new user in the application. It accepts user details and creates a new user account.

### Required Data
The following data is required in the request body for successful registration:

- **email**: A valid email address of the user.
- **fullName**: An object containing the user's full name.
  - **firstName**: The first name of the user (minimum 3 characters).
- **password**: A password for the user account (minimum 6 characters).

### Request Example
```json
{
  "email": "user@example.com",
  "fullName": {
    "firstName": "John"
  },
  "password": "securepassword"
}


# User Authentication Endpoints Documentation

## Endpoint: `/users/profile`

### Description
The `/users/profile` endpoint returns the profile information of the authenticated user.

### Authentication
A valid authentication token is required. The token can be provided either as a cookie named `token` or via the `Authorization` header in the format:
### Possible Status Codes
- **200 OK**: Successfully retrieved the user profile.
- **401 Unauthorized**: Missing, invalid, or blacklisted token.

### Response Example
```json
{
  "_id": "60c72b2f5f1b2c001c8e4d1a",
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "user@example.com",
  // ... other user properties
}

# User Logout Endpoints Documentation

## Endpoint: `/users/logout`

### Description
The `/users/logout` endpoint logs out the currently authenticated user. It clears the authentication cookie and adds the token to a blacklist to prevent further use.

### Authentication
A valid authentication token must be provided. The token can be sent either as a cookie named `token` or via the `Authorization` header in the following format:


### Possible Status Codes
- **200 OK**: The user has been successfully logged out.
- **401 Unauthorized**: No token provided, invalid token, or token is already blacklisted.

### Response Example
```json
{
  "message": "Logged out successfully"
}