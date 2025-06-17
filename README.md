<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Project Setup and Configuration
| name | version |
|--|--|
| Node.js | v20.11.1 |

## Development Environment

1. Install dependencies:
```bash
$ npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env.development`
   - Configure your database and other environment variables as needed

3. Start the development database:
```bash
$ npm run docker:dev
```
This command will:
- Start a PostgreSQL container with the development database
- Wait for the database to be ready for connections
- Excecutes the comand `$ npm run start:dev`

4. Run database migrations and seed initial data:
```bash
$ npm run migration:run
$ npm run seed:dev
```

5. Start the application:
The previous command start de project (`$ npm run docker:dev`) but the Nest.js commands still works as well.
```bash
# Standard development mode
$ npm run start

# Watch mode (recommended for development)
$ npm run start:dev

# Debug mode
$ npm run start:debug
```
### Notes

* When you stop the project using `Ctrl + C`, the NestJS app will stop, but the Docker container will remain running.
If the container is still running, you don’t need to run `$ npm run docker:dev` again — you can use one of the previously mentioned commands to start the project.

* To completely reinitialize the Docker container from scratch:

    1- Stop the container if it's running.

    2- Delete the postgres volume located in the /docker/development/ directory.

    3- Run the following command again to rebuild and start the container:

    ```bash
    $ npm run docker:dev
    ```

## Testing Environment

### Unit Tests
Unit tests don't require a database connection and can be run directly:

```bash
# Run unit tests
$ npm run test

# Run unit tests in watch mode
$ npm run test:watch

# Generate unit test coverage report
$ npm run test:cov
```

### E2E Tests
E2E tests require a dedicated test database. Follow these steps in order:

1. Start the test database container:
```bash
$ npm run docker:test
```

2. Seed the test database with initial test data:
```bash
$ npm run seed:test
```

3. Run the E2E tests:
```bash
$ npm run test:e2e
```

To run E2E tests again:
1. Remove the test database container and its volume. The path is `/docker/test/`, delete the `postgres` folder.
2. Repeat the steps above in the same order

Additional E2E test commands:
```bash
# Run E2E tests in watch mode
$ npm run test:e2e:watch

# Generate E2E test coverage report
$ npm run test:e2e:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
