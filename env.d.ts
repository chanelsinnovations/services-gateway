declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    environment: string;
    JWT_TOKEN: string;
    role_user_url: string;
  }
}
