[![N|Solid](https://static.wixstatic.com/media/72ffe6_da8d2142d49c42b29c96ba80c8a91a6c~mv2.png)](https://nasriya.net)
# Logify.
[![Static Badge](https://img.shields.io/badge/license-Free_(Restricted)-blue)](https://github.com/nasriyasoftware/Logify?tab=License-1-ov-file) ![Repository Size](https://img.shields.io/github/repo-size/nasriyasoftware/Logify.svg) ![Last Commit](https://img.shields.io/github/last-commit/nasriyasoftware/Logify.svg) [![Status](https://img.shields.io/badge/Status-Stable-green.svg)](link-to-your-status-page)
##### Visit us at [www.nasriya.net](https://nasriya.net).

Logify is a simple and powerful **Node.js** logging package.

Made with ❤️ in **Palestine** 🇵🇸

> [!IMPORTANT]
> 🌟 **Support Our Open-Source Development!** 🌟
> We need your support to keep our projects going! If you find our > work valuable, please consider contributing. Your support helps us > continue to develop and maintain these tools.
> 
> **[Click here to support us!](https://fund.nasriya.net/)**
> 
> Every contribution, big or small, makes a difference. Thank you for > your generosity and support!
___
### Installation
```shell
npm i @nasriya/logify
```

### Importing
Import in **ES6** module
```ts
import logify from '@nasriya/logify';
```

Import in **CommonJS (CJS)**
```js
const logify = require('@nasriya/logify').default;
```

### Configuration
You can configure the `logify` instance to suite your needs. Here's how you can configure it:

```ts
logify.config({
    /**The name of the running service or process. Default: `process.pid` */
    service: 'myTestApp',
    /**Set different handlers for more robust error handling */
    handlers: {
        uncaughtException: (error: Error, origin) => {
            // handle uncought exeptions; for example:
            logify.log(error); // Logs the error
        }
    },
    /**An absolute path to the directory where you want the logs to be stored at. Default: The project directory. */
    logLocation: `\\\\10.0.0.217\\Dev\\myTestApp` // A network location or a local directory
})
```

**Note:** All configurations are optional.
___
### Usage
Here are some examples as of how to use the **Logify** package.

###### Throw an error
Whenever needed, you can throw a new `AppError`. Errors created from this class are automatically logged.
```ts
throw new logify.errors.AppError({ message: 'An error has occurred' });
// ⇨ AppError: An error has occurred
```

You can also throw errors with additional data if you want:
```ts
throw new logify.errors.AppError({
    message: 'Unauthorized user',
    name: 'HTTP',
    severity: 'Low'
});

// ⇨ HTTP: Unauthorized user
```

**Note:** If you only want to log the error, do **NOT** `throw` the error.

###### Log Incoming Requests
You can use predefined middlewares designed for specific server frameworks like [HyperCloud](https://github.com/nasriyasoftware/HyperCloud) or [Express.js](https://github.com/expressjs/express).

The middlewares can be accessed by:
```ts
const hypercloudMiddleware = logify.middlewares.hypercloud;
console.log(typeof hypercloudMiddleware); // ⇨ function
```
###### General Logging
**Logify** doesn't only [log errors](#throw-an-error) and [incoming requests](#log-incoming-requests), you can log pretty much anything you want to the console as well as in the logs files.
```ts
const message = 'Hello World!'
const user = { name: 'John Doe', dob: new Date('1985-05-10') }
const error = new Error('A test error');

logify.logger.log(message);     // Log a string
logify.logger.log(user);        // Log an object
logify.logger.log(error);       // Log an error
```
Thank you.
___
## License
Please read the license from [here](https://github.com/nasriyasoftware/Logify?tab=License-1-ov-file).