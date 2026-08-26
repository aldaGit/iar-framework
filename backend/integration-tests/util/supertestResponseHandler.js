exports.handleResponse = function (callbackFn) {
    return (error, response) => {
        if (error) return callbackFn(error);
        callbackFn();
    };
}
