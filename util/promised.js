module.exports = function(callable)
{
    return function(path)
    {
        try {
            var module = callable(path.split("#")[0]);
            return Promise.resolve(module);
        } catch(e) {
            return Promise.reject(e);
        }
    }
}

