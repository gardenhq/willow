module.exports = function(resolveIdentifier, traverse)
{
    return function(key)
    {
        key = key || "arguments";
        return function(container, definition)
        {
            if(definition[key] == null) {
                return Promise.resolve();
            }
            var promises = [];
            traverse(
                definition[key],
                function(item, i, obj)
                {
                    promises.push(resolveIdentifier(item, container));
                    return promises.length - 1;
                }
            );
            return Promise.all(
                promises
            ).then(
                function(results)
                {
                    traverse(
                        definition[key],
                        function(item, i, obj)
                        {
                            return results[item];
                        }
                    );
                    return definition[key];
                }
            );
        }
    };
};
