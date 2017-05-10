module.exports = function(loader, resolveArguments, resolveIdentifier, traverse)
{
    const callsKey = "calls";
    return loader(
        "class",
        function(resolve, reject, module, object, container, definition)
        {
            return resolveArguments(container, definition).then(
                function(args)
                {
                    const promises = [];
                    (definition[callsKey] || []).forEach(
                        function(item, i, arr)
                        {
                            const args = item[1] || [];
                            traverse(
                                args,
                                function(item, i, obj)
                                {
                                    promises.push(resolveIdentifier(item, container));
                                    return promises.length - 1;
                                }
                            );
                        }
                    );

                    Promise.all(
                        promises
                    ).then(
                        function(results)
                        {
                            const instance = new (
                                Function.prototype.bind.apply(
                                    module,
                                    [module].concat(args)
                                )
                            );
                            (definition[callsKey] || []).forEach(
                                function(item, i, arr)
                                {
                                    const method = item[0];
                                    const args = item[1] || [];
                                    traverse(
                                        args,
                                        function(item, i, obj)
                                        {
                                            return results[item];
                                        }
                                    );
                                    instance[method].apply(instance, args);
                                }
                            );
                            resolve(
                                instance
                            );

                        }
                    ).catch(
                        function(e)
                        {
                            reject(e);
                        }
                    );


                }
            );
        }
    );
    
}
