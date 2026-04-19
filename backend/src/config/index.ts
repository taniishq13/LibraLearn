const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const config = {
  port: toNumber(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongoUri:
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/libralearn",
  jwtSecret: process.env.JWT_SECRET ?? "replace_me_with_a_strong_secret"
};
