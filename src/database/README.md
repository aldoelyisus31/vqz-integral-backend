# Database Management

This directory contains all database-related configurations, migrations, seeds, and factories for the application.

## Directory Structure

```
database/
├── factories/        # Factory functions to generate test data
├── migrations/       # TypeORM migrations
├── seeds/           # Seed files for populating the database
├── data-source.ts   # TypeORM data source configuration
├── seed.ts          # Main seeding script
└── README.md        # This file
```

## Available Commands

### Migrations

- Generate a new migration:
  ```bash
  npm run migration:generate -- src/database/migrations/MigrationName
  ```

- Run pending migrations:
  ```bash
  npm run migration:run
  ```

- Revert last migration:
  ```bash
  npm run migration:revert
  ```

### Database Seeding

Seeds are available for different environments:

- Development environment:
  ```bash
  npm run seed:dev
  ```

- Testing environment:
  ```bash
  npm run seed:test
  ```

- Production environment:
  ```bash
  npm run seed:prod
  ```

## Environment Configuration

The database configuration is loaded from environment-specific files:
- `.env.development` for development
- `.env.testing` for testing
- `.env.production` for production

Make sure these files exist and contain the correct database configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=your_database_name
```

## Adding New Seeds

1. Create a factory in `factories/` if needed
2. Create a seed file in `seeds/`
3. Add the seed to `database.seed.ts`

## Best Practices

- Always use migrations in production
- Use `synchronize: true` only in development
- Test seeds in development before running in production
- Keep seeds idempotent when possible
- Use factories for generating test data