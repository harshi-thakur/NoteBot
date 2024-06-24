function errorHandler(error, name, from) {
    let loggerFunction = console.log;
    loggerFunction("----------------START------------------");
    loggerFunction("Error occurred in " + name);
    if (from === "axios") {
        if (error.response) {
            // loggerFunction(error.response);
            loggerFunction(error.response.data);
            loggerFunction(error.response.status);
            loggerFunction(error.response.headers);
        }
        else if (error.request) {
            loggerFunction(error.request);
        }
        else {
            loggerFunction("ERROR", error.message);
        }
        loggerFunction(error.toJSON());
    }
    else {
        loggerFunction(error);
    }
    loggerFunction("----------------END------------------");
}
module.exports = { errorHandler}