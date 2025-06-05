interface Config {
  apiUrl: string;
  env: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

const config: Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

export default config; 