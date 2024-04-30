import Logify from "../main.ts";
const logify = new Logify();

// console.log('Process ID:', logger.logger.log())

logify.logger.log('Test Message')
const error = logify.errors.AppError({
    message: 'Test error description',
    data: {
        user: {
            loggedIn: true,
            id: null
        }
    }
});


// throw error
// console.error(error);
// process.exit(1)

// let number = 0, interval;
// function throwErrors() {
//     if (number < 5) {
//         logger.errors.AppError({ name: 'PaymentError', message: 'Test error description' });
//     } else {
//         clearInterval(interval);
//         interval = undefined;
//     }
// }

// interval = setInterval(throwErrors, 500);