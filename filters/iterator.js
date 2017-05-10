module.exports = function(resolveArguments, key)
{
    key = key || "iterator";
    return function iterator(container, definition, id, definitions)
    {
        if(typeof definition[key] !== "undefined") {
            container.set(
                id,
                function()
                {
                    return resolveArguments(container, definition).then(
                        function(args)
                        {
                            return container.get(definition[key].substr(1)).then(
                                function(iterator)
                                {
                                    var iterable = args[0];
                                    // var res = args[0].map(
                                    //  function(items, i, arr)
                                    //  {
                                    //      return Object.keys(items).map(
                                    //          function(key, i, arr)
                                    //          {
                                    //              return iterator(items[key], key);
                                    //          }
                                    //      );
                                    //  }
                                    // )
                                    var res = Object.keys(iterable).map(
                                        function(key, i, arr)
                                        {
                                            return iterator(iterable[key], key);
                                        }
                                    );
                                    //the function is returned and therefore can be called and called etc etc
                                    // why?
                                    return res;
                                    return function()
                                    {
                                        return res;
                                    };
                                }
                            );

                        }
                    );

                }
            );
        }
    }
}

