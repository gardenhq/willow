module.exports = function(loader, resolveArguments)
{
    return loader(
        "callable",
        function(resolve, reject, module, object, container, definition)
        {
            return resolveArguments(container, definition).then(
                function(args)
                {
                    try {
                        var result = module.apply(object, args);
                    } catch(e) {
                        reject(e);
                        // reject(new TypeError("'" + definition.callable + "' is not callable/a function"));
                    }
                    resolve(
                        result
                    );
                }
            );
        }
    );
}
