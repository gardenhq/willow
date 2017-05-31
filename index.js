module.exports = function(promisedRequire, resolve, register, config, containerlike)
{
    var name = __dirname;
    var id = "willow.";
    config = name + "/conf/javascript.js";
    if(promisedRequire == null) {
        //probably testing
        var $require = require;
        var promised = $require("./util/promised");
        promisedRequire = promised(
            function(path)
            {
                return require(path.replace(name, "./"));
            }
        );
    }
    var modules = [
        "Builder.js",
        "filters/index.js",
        "conf/index.js"
    ];
    if(containerlike == null) {
        modules.push("Container.js");
    }
    return Promise.all(
        modules.map(
            function(item)
            {
                return promisedRequire(name + "/" + item);
            }
        )
    ).then(
        function(modules)
        {
            var container = containerlike == null ? new modules[3]() : containerlike;
            container.set(
                id + "system.import",
                function()
                {
                    return promisedRequire;
                }
            );
            container.set(
                id + "system.resolve",
                function()
                {
                    return resolve;
                }
            );
            container.set(

                id + "system.registerDynamic",
                function()
                {
                    return register;
                }
            );
            var builder = new modules[0](
                container,
                promisedRequire // for importing
            );
            return modules[1](container).then(
                function(filters)
                {
                    return builder.use(
                        filters
                    ).set(
                        id + "resolve.resolve",
                        function()
                        {
                            return builder.get(id + "resolver")("resolve");
                        }
                    );
                }
            ).then(
                function(builder)
                {
                    var filters = modules[2]();
                    return builder.load(filters).then(
                        function()
                        {
                            return Promise.all(
                                Object.keys(filters).map(
                                    function(key, i, arr)
                                    {
                                        return builder.get(key);
                                    }
                                )
                            ).then(
                                function(filters)
                                {
                                    return builder;
                                }
                            );
                        }
                    );
                }
            ).then(
                function(builder)
                {
                    return builder.load(config);
                }
            ).then(
                function(builder)
                {
                    return Promise.all(builder.getTagged(id + "filter")).then(
                        function()
                        {
                            return builder;
                        }
                    );
                }
            );
        }
    );
};
