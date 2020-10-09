export interface AppConfig {
  env: string;
  isProduction: string;
  brandName: string;
  host: string;
  port: number;
  globalApiPrefix: string;
  mongo: {
    connStr: string;
    dbName: string;
  };
  paths: {
    assetsFolder: string;
    clientIndexFile: string;
  };
  auth: {
    jwt: {
      accessTokenExpiresIn: number | string;
      accessTokenSecretKey: string;
      refreshTokenExpiresIn: number | string;
      refreshTokenSecretKey: string;
    }
  };
  logging: {
    isDebug: boolean;
    isLogClientRequests: boolean;
    excludedLogRequests?: string[];
    isLogClientResponses: boolean;
    excludedLogResponses?: string[];
    isLogKeepAliveRequests: boolean;
    maxLogRecords: number;
  };
  simulation: {
    isEnabled: boolean;
  };
  mail: {
    domain: string;
    apiKey: string;
    fromEmail: string;
    fromTitle: string;
    mailStatusLink: string; // e.g., 'https://app.mailgun.com/app/sending/domains/{domain name}/logs',
  };
  encryption: {
    algorithm: string,
    key: string, // must be 32 chars
    ivLen: number,
    password: {
      saltSize: number,
      saltFormat: string,
      algorithm: string;
    }
  }
}
