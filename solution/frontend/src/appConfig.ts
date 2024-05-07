type Config = {
  API_BASE_URL: string,
  AUTO_REFRESH_INTERVAL: number,
};

const AppConfig: Config = {
  API_BASE_URL: 'http://localhost:7777',
  AUTO_REFRESH_INTERVAL: 10000,   // in milliseconds

};

export default AppConfig;