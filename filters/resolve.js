module.exports = function(resolveResolve, key, serviceKey, servicePrefix)
{
    key = key || "resolve";
    serviceKey = serviceKey || "service";
    servicePrefix = servicePrefix || "@";

    return function(container, definition, id, definitions)
    {
        if(definition[key] == null) {
            return;
        }
        const service = definition[serviceKey];
        const newService = function()
        {
            var container = this;
            let keys = definition[key].filter(
                function(item, i, arr)
                {
                    return (item.indexOf(servicePrefix) === 0);
                }
            );
            return resolveResolve(container, definition).then(
                function(result)
                {
                    const get = container.get.bind(container);
                    // const getTagged = container.getTagged.bind(container);
                    keys = keys.map(
                        function(item, i, arr)
                        {
                            if(!container.has(item)) {
                                container.set(
                                    item,
                                    function(container){return result[i]}
                                );
                            }
                            return item.substr(servicePrefix.length);
                        }
                    );

                    // hackity hack, look at a better proxy?
                    // and use Symbols instead of servicePrefix?
                    // also needs to work for getTagged
                    container.get = function(key)
                    {
                        if(keys.indexOf(key) !== -1) {
                            key = servicePrefix + key;
                        }
                        return get(key);
                    };
                    return new Promise(
                        function(resolve, reject)
                        {
                            //if(typeof service == "function") {
                                try {
                                    resolve(
                                        service.apply(
                                            container,
                                            keys.map(
                                                function(item)
                                                {
                                                    return container.get(item);
                                                }
                                            )
                                        )
                                    )
                                } catch (e) {
                                    reject(e);
                                }
                            //} else {
                            //  resolve();
                            //}
                        }
                    );
                }
            );  
        };
        definition[serviceKey] = null;
        container.set(
            id,
            newService
        );
    }
}


