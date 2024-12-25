export const config = () => ({
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI,
  JwtExpiresIn: process.env.JWT_EXPIRES_IN,
});
