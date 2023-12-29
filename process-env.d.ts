declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_CLIENT_SECRET: string;
      DISCORD_TOKEN: string;
      DISCORD_CLIENT_ID: string;
      API_URL: string;
      ICON_URL: string;
      SUPPORT_URL: string;
      BOT_NAME: string;
    }
  }
}