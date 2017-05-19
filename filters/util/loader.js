module.exports = function(require, register, walkPath, splitIdentifier, findIdentifier)
{
    var requiresKey = "requires";
    var bundleKey = "bundle";
    var versionKey = "version";
    var ignoreRequireKey = "ignore-require"; // getting too much split out, "headers" again
    return function(key, cb)
    {
        if(require == null) {
            return function(){}
        }
        return function(builder, definition, id, definitions)
        {
            // i have the builder here, so do I need to pass in
            // require and register??
            //console.log(builder.get("*.system.import"));
            if(definition[key] == null) {
                return;
            }
            const service = function()
            {
                var container = this;
                return new Promise(
                    function(resolve, reject)
                    {
                        // don't ever do this twice
                        var loaded;
                        var identifier = splitIdentifier(definition[key]);
                        var serviceIdentifier = findIdentifier(identifier);
                        if(serviceIdentifier) {
                            loaded = container.get(serviceIdentifier);
                            if(!(loaded instanceof Promise)) {
                                loaded = Promise.resolve(loaded);   
                            }
                        } else {
                            if(definition[bundleKey] === false) {
                                var temp = identifier.file.split("#");
                                var headers = {
                                    "Cache-Control": "private"
                                };
                                if(temp[1]) {
                                    headers["Content-Type"] = temp[1];
                                }
                                // TODO: need addHeaders(path, {})
                                identifier.file = temp[0] + "#" + JSON.stringify({"Cache-Control": "private"});

                            }
                            if(definition[ignoreRequireKey] === true) {
                                var temp = identifier.file.split("#");
                                // TODO: need addHeaders(path, {})
                                identifier.file = temp[0] + "#" + JSON.stringify({"Content-Type": "application/javascript+bundle"});

                            }
                            if(definition[versionKey] != null) {
                                identifier.file += "#@" + definition[versionKey];
                            }
                            // inject something here?
                            // "requires": [{"hyper": @overwrite:./overwrite.js}]
                            var requires = definition[requiresKey] || [];
                            loaded = Promise.all(
                                requires.map(
                                    function(item)
                                    {
                                        return container.get("require." + item)
                                    }
                                )
                            ).then(
                                function(modules)
                                {
                                    requires.forEach(
                                        function(item, i, arr)
                                        {
                                            register(
                                                item,
                                                [],
                                                true,
                                                function(module)
                                                {
                                                    return modules[i]
                                                }
                                            );
                                        }
                                    );
                                    return require(
                                        identifier.file
                                    )
                                }
                            );
                        }
                        //
                        loaded.then(
                            function(module)
                            {
                                var object;
                                if(identifier.path != null) {
                                    object = module;
                                    module = walkPath(identifier.path, module);
                                }
                                return cb(resolve, reject, module, object, builder, definition);
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
            builder.set(id, service);
        }
    }
};
