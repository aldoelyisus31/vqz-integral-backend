import { APP_CONFIG, APP_CONFIG_SCHEMA, validateAppConfig } from './app.config';

describe('App Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('APP_CONFIG', () => {
    it('should return configuration object with environment variables', () => {
      //* Setup environment variables ------------------
      process.env.NODE_ENV = 'development';
      process.env.APP_NAME = 'Test App';
      process.env.APP_PORT = '3000';
      process.env.DB_HOST = 'localhost';
      process.env.DB_PORT = '5432';
      process.env.DB_USERNAME = 'user';
      process.env.DB_PASSWORD = 'password';
      process.env.DB_NAME = 'testdb';
      process.env.BCRYPT_SALT_ROUNDS = '10';
      process.env.JWT_SECRET = 'secret';
      process.env.JWT_EXPIRES_IN = '1h';

      const config = APP_CONFIG();

      expect(config).toEqual({
        node_env: 'development',
        app: {
          name: 'Test App',
          port: 3000,
        },
        db: {
          host: 'localhost',
          port: 5432,
          user: 'user',
          password: 'password',
          name: 'testdb',
        },
        bcrypt: {
          saltRounds: 10,
        },
        jwt: {
          secret: 'secret',
          expiresIn: '1h',
        },
      });
    });
  });

  describe('validateAppConfig', () => {
    it('should validate correct configuration', () => {
      const config = {
        NODE_ENV: 'development',
        APP_NAME: 'Test App',
        APP_PORT: 3000,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'user',
        DB_PASSWORD: 'password',
        DB_NAME: 'testdb',
        BCRYPT_SALT_ROUNDS: 10,
        JWT_SECRET: 'secret',
        JWT_EXPIRES_IN: '1h',
      };

      const validatedConfig = validateAppConfig(config);
      expect(validatedConfig).toEqual(config);
    });

    it('should use default values for optional fields', () => {
      const minimalConfig = {
        DB_HOST: 'localhost',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'password',
        DB_NAME: 'testdb',
        JWT_SECRET: 'secret',
        JWT_EXPIRES_IN: '1h',
      };

      const validatedConfig = validateAppConfig(minimalConfig);

      expect(validatedConfig).toMatchObject({
        NODE_ENV: 'development',
        APP_NAME: 'NestJS API',
        APP_PORT: 3000,
        DB_PORT: 5432,
        BCRYPT_SALT_ROUNDS: 10,
      });
    });

    it('should throw error for missing required fields', () => {
      const invalidConfig = {
        APP_NAME: 'Test App',
      };

      expect(() => validateAppConfig(invalidConfig)).toThrow('Configuration validation error');
    });

    it('should throw error for invalid field types', () => {
      const invalidConfig = {
        NODE_ENV: 'development',
        APP_NAME: 'Test App',
        APP_PORT: 'invalid', //? should be number
        DB_HOST: 'localhost',
        DB_PORT: '5432', //? should be number
        DB_USERNAME: 'user',
        DB_PASSWORD: 'password',
        DB_NAME: 'testdb',
        BCRYPT_SALT_ROUNDS: 'ten', //? should be number
        JWT_SECRET: '', //? should be non-empty string
        JWT_EXPIRES_IN: '1h',
      };

      expect(() => validateAppConfig(invalidConfig)).toThrow('Configuration validation error');
    });
  });

  describe('APP_CONFIG_SCHEMA', () => {
    it('should validate required fields individually', () => {
      const { error } = APP_CONFIG_SCHEMA.validate({}, { abortEarly: false });
      const messages = error?.details.map(detail => detail.message) || [];

      expect(messages).toEqual(
        expect.arrayContaining([
          expect.stringContaining('"DB_HOST" is required'),
          expect.stringContaining('"DB_USERNAME" is required'),
          expect.stringContaining('"DB_PASSWORD" is required'),
          expect.stringContaining('"DB_NAME" is required'),
          expect.stringContaining('"JWT_SECRET" is required'),
          expect.stringContaining('"JWT_EXPIRES_IN" is required'),
        ]),
      );
    });

    it('should accept valid configuration', () => {
      const validConfig = {
        NODE_ENV: 'development',
        APP_NAME: 'Test App',
        APP_PORT: 3000,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'user',
        DB_PASSWORD: 'password',
        DB_NAME: 'testdb',
        BCRYPT_SALT_ROUNDS: 10,
        JWT_SECRET: 'secret',
        JWT_EXPIRES_IN: '1h',
      };

      const { error } = APP_CONFIG_SCHEMA.validate(validConfig);
      expect(error).toBeUndefined();
    });
  });
});