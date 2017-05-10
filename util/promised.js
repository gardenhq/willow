module.exports = function(callable)
{
    return function()
    {
        try {
            var module = callable.apply(null, arguments);
            return Promise.resolve(module);
        } catch(e) {
            return Promise.reject(e);
        }
    }
}

