module.exports = function(loader, resolveArguments, key)
{
    key = key || "filter";
    return function(container, definition, id, definitions)
    {
        loader(
            "filter",
            function(resolve, reject, module, object, builder, definition)
            {
                return resolveArguments(builder, definition).then(
                    function(args)
                    {
                        var result = module.apply(object, args);
                        builder.use(result);
                        resolve(
                            result
                        );
                    }
                );
            }
        )(container, definition, id, definitions);
    }
}

