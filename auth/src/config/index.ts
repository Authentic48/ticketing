// It is recommanded to parse all your config env variables from
// process.env here and export them as some interface for example:
// ```
// interface AppConfig {
//   host: string
//   port: number
//   jwtSecret: string
// }
// ```
// export const appConfig: AppConfig = { host: process.env.HOST, port: Number(process.env.PORT), // ...etc }
//
// you can alsoe use Joi npm package to validate environment variables before parsing them.
//
// the goal of this config package is it should handle all configuration concerns and we use the
// AppConfig interface in other places of the application instead of working with `process.env`
// in the application business logic.