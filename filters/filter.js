module.exports = function(loader, resolveArguments, key)
{
    key = key || "filter";
    return function(container, definition, id, definitions)
    {
            loader(
                "filter",
                function(resolve, reject, module, object, builder, definition)
                {
                    // console.log(id);
                    return resolveArguments(builder, definition).then(
                        function(args)
                        {
                            var result = module.apply(object, args);
                            // console.log(result);
                            builder.use(result);
                            resolve(
                                result
                            );
                        }
                    ).then(
                        function(obj)
                        {
                            // console.log(id);
                            return obj;
                        }

                    );
                }
            )(container, definition, id, definitions);
        // if(!container.has(id)) {
        //  return container.get(id);

        // }
    }
}

