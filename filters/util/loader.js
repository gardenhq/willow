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
                            var headers = {};
                            var temp = identifier.file.split("#");
                            if(temp[1]) {
                                headers["Content-Type"] = temp[1];
                            }
                            if(definition[bundleKey] === false) {
                                headers['Cache-Control'] = "private";
                            }
                            if(definition[ignoreRequireKey] === true) {
                                headers["Content-Type"] = "application/javascript+bundle";
                            }
                            if(definition[versionKey] != null) {
                                headers["X-Content-Version"] = definition[versionKey];
                            }
                            if(Object.keys(headers).length > 0) {
                                identifier.file = temp[0] + "#" + JSON.stringify(headers);
                            }
                            var requires = definition[requiresKey] || [];
                            // TODO: deprecate this
                            if(Array.isArray(requires)) {
                                var obj = {};
                                requires.map(
                                    function()
                                    {
                                        obj[item] = "@require." + item;
                                    }
                                );
                                requires = obj;
                            }
                            var keys = Object.keys(requires);
                            loaded = Promise.all(
                                keys.map(
                                    function(item)
                                    {
                                        // TODO: check for other things not just @service.id
                                        return container.get(requires[item].substr(1));
                                    }
                                )
                            ).then(
                                function(modules)
                                {
                                    keys.forEach(
                                        function(item, i, arr)
                                        {
                                            register(
                                                item,
                                                [],
                                                true,
                                                function(module, exports, require, __filename, __dirname)
                                                {
                                                    module.exports = modules[i];
                                                }
                                            );
                                        }
                                    );
                                    return modules;

                                }
                            ).then(
                                function(modules)
                                {
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
