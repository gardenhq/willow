module.exports = function(resolveArguments, key)
{
    key = key || "iterator";
    return function iterator(builder, definition, id, definitions)
    {
        var container = builder.getContainer();
        if(typeof definition[key] !== "undefined") {
            container.set(
                id,
                function()
                {
                    return resolveArguments(builder, definition).then(
                        function(args)
                        {
                            return builder.get(definition[key].substr(1)).then(
                                function(iterator)
                                {
                                    var iterable = args[0];
                                    var res;
                                    if(Array.isArray(iterable)) {
                                        res = [];
                                    } else {
                                        res = {};
                                    }
                                    Object.keys(iterable).forEach(
                                        function(key, i, arr)
                                        {
                                            res[key] = iterator(iterable[key], key);
                                        }
                                    );
                                    return res;
                                }
                            );

                        }
                    );

                }
            );
        }
    }
}

