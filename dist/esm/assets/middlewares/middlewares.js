import helpers from "../../utils/helpers";
class LogifyMiddlewares {
    _logger;
    _diver = '#'.repeat(100);
    constructor(logger) {
        this._logger = logger;
    }
    _utils = {
        scanAndReplaceSensitiveData: (obj) => {
            if (!(helpers.isRealObject(obj) || Array.isArray(obj))) {
                return obj;
            }
            const sensitiveInfo = ['password', 'passwords', 'apikey', 'api_key', 'token', 'access_token', 'accesstoken', 'secret', 'name', 'email', 'address', 'phone', 'ssn', 'health_info', 'healthinfo', 'medical_condition', 'medicalcondition', 'treatment', 'patient_id', 'patientid'];
            // If the object is an array, recursively scan each element
            if (Array.isArray(obj)) {
                return obj.map((item) => this._utils.scanAndReplaceSensitiveData(item));
            }
            // Iterate through each property of the object
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    // If the property name matches any sensitive info, replace its value
                    if (sensitiveInfo.includes(key.toLowerCase())) {
                        obj[key] = 'LogifySensitiveData';
                    }
                    else {
                        // If the property value is an object or array, recursively scan it
                        if (helpers.isRealObject(obj[key])) {
                            obj[key] = this._utils.scanAndReplaceSensitiveData(obj[key]);
                        }
                    }
                }
            }
            return obj;
        }
    };
    /**A middleware used specifically with Nasriya HyperCloud framework */
    hypercloud = (request, response, next) => {
        try {
            const content = [];
            content.push(this._diver, `${'#'.repeat(39)} Incoming HTTP Request ${'#'.repeat(38)}`, this._diver);
            content.push(`HTTP [${request.method}] Request from [${request.ip}] to [${request.href}]`);
            content.push(`Request ID: ${request.id}`);
            if (helpers.isRealObject(request.query) && Object.keys(request.query).length > 0) {
                content.push(`Query: ${JSON.stringify(request.query, null, 4)}`);
            }
            content.push(`Headers: ${JSON.stringify(request.headers, null, 4)}`);
            if (['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'TRACE', 'CONNECT'].includes(request.method)) {
                if (request.bodyType === 'json') {
                    const sanitizedBody = this._utils.scanAndReplaceSensitiveData({ ...request.body }); // Copy the body without affecting the request body
                    content.push(`Body: ${JSON.stringify(sanitizedBody), null, 4}`);
                }
            }
            content.push(`User: ${JSON.stringify(request.user, null, 4)}`);
            content.push(`Locale: ${request.locale}`);
            content.push(`Language: ${request.language}`);
            content.push(`Color Scheme: ${JSON.stringify(request.colorScheme, null, 4)}`);
            content.push(this._diver, `${'#'.repeat(41)} HTTP Request End ${'#'.repeat(41)}`, this._diver);
            this._logger.log(content.join('\n'), 'Info');
        }
        catch (error) {
            this._logger.log(error, 'Error');
        }
        finally {
            next();
        }
    };
}
export default LogifyMiddlewares;
