/**
 * This will act as environment variable to ease 
 * using this project on someone else.
 *
 * So no need for declaring these variables in .env file.
 */
export default {
  FRONTEND_URL: 'https://frontend.foo.bar', 
  BACKEND_URL: 'https://backend.foo.bar',
  JWT_SECRET: '0123456789',
  SECURE_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: true,
    domain: '.foo.bar'
  }
}