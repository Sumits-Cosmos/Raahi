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