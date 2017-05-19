module.exports = function($require, key)
{
    key = key || "imports";
    var resourceKey = "resource";
    var versionKey = "version";
    return function importer(container, definition, id, definitions)
    {
        if(id == key) {
            return Promise.all(
                definition.map(
                    function(item)
                    {
                        var path = item;
                        if(typeof path != "string") {
                            path = item[resourceKey]
                        }
                        if(item[versionKey] != null) {
                            path += "#@" + item[versionKey];
                        }
                        return $require(path);
                    }
                )
            ).then(
                function(imports)
                {
                    var promises = imports.map(
                        function(config)
                        {
                            // is callable?
                            if(typeof config === "function") {
                                config = config(container);
                            }
                            if(typeof config !== "object") {
                                throw new Error("That import doesn't return/resolve to an object");
                            }
                            Object.keys(config).forEach(
                                function(id)
                                {
                                    if(id != key) {
                                        if(typeof definitions[id] === "undefined" || definitions[id].constructor == Object) {
                                            if(config[id] == null || config[id].constructor !== Object) {
                                                definitions[id] = config[id];
                                            } else {
                                                definitions[id] = Object.assign(
                                                    config[id],
                                                    definitions[id]
                                                );
                                            }
                                        }   
                                    }
                                }
                            );
                            if(typeof config[key] !== "undefined" ) {
                                return importer(container, config[key], key, definitions);
                            } else {
                                return definitions;
                            }
                        }
                    );
                    return Promise.all(
                        promises
                    ).then(
                        function(d)
                        {
                            return d[0];
                        }
                    )
                }
            );
        } else {
            return Promise.resolve(definitions);
        }
    }
        
}
