# pc-assignment-be

## Cloning

Make sure to clone **recursively** in order to clone the required submodule as well:

```sh
git clone --recursive <repo url>
```

## Prerequisites

Make sure to supply a database file (by default it's `test-db.sql` - you can change this in `config.env`) - it is not provided by default to prevent leaks since the original repository specified that it would be provided by e-mail,

Optionally, make sure that you have [GNU Make](https://www.gnu.org/software/make/) on your machine if you don't want to run the project manually.

## Project structure

This project is structured in three logical components: database, backend and frontend.

The database is ran via Docker as a premade ready-to-use environment, while the frontend and backend are ran locally since they're launched in dev/debug mode so we don't need to containerize them for production.

The backend is based on the controller-service-repository pattern, but since it's relatively simple, the service layer was excluded in order to reduce complexity.

## Configuration

See `config.env` for the configuration variables. They are not automatically read by the application code (e.g. via a dotenv package or similar) but are meant to be passed externally in order to facilitate a clearer separation of concerns.

This is already taken care of in the `Makefile`, but if you're running manually, you will have to pass the environment variables to the applications in any way you prefer.

## How to run

You can run this project in multiple ways:

- If you're using VS Code, you can: `Ctrl + Shift +P` > `Run Task` > `Run All Processes`
- Otherwise, in different shell contexts, you can run: `make run-db`, `make run-be` and `make run-fe`
- Otherwise, you can run the respective components manually (however, please refer to the `Makefile` to see how to properly execute them)

## Notes

This project uses a forked version of the [original repository](https://github.com/ishak-dev/BankApp-Test) as a submodule due to a typo bug in the original, which is fixed in the fork.

In the original assignment description and code, it is specified that `http://localhost:3306` is used as the default backend API url; however, this is [actually different in practice](https://github.com/ishak-dev/BankApp-Test/blob/bb053a36899beaf1dd25348a2f6b2f360a20d9c8/src/store/hostStore.ts#L9), and as such, the backend uses `8080` as its default intended port.
