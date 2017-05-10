module.exports = function(container)
{ 
    var root = "willow";
    var servicePrefix = "@";
    var tagPrefix = "#";
    var identifierSplitter = ":";

    var System_import = container.get(root + ".system.import");
    var System_registerDynamic = container.get(root + ".system.registerDynamic");
    return Promise.all(
        [
            "/filters/util/loader",
            "/filters/util/walkPath",
            "/filters/util/resolveIdentifier",
            "/filters/util/traverse",
            "/filters/util/resolver",
            "/filters/util/splitIdentifier",
            "/filters/util/findIdentifier",

            "/filters/imports",
            "/filters/callable",
            "/filters/filter"
        ].map(
            function(item)
            {
                return "@gardenhq/" + root + item;
            }
        ).map(function(item){ return System_import(item) })
    ).then(
        function(modules)
        {

            var loader = modules[0];
            var walkPath = modules[1];
            var createResolveIdentifier = modules[2];
            var traverse = modules[3];
            var createResolver = modules[4];
            var splitIdentifier = modules[5](identifierSplitter);
            var findIdentifier = modules[6](servicePrefix);

            var importer = modules[7];
            var callabled = modules[8];
            var filtered = modules[9];

            var loadAndEval = loader(
                System_import,
                System_registerDynamic,
                walkPath,
                splitIdentifier,
                findIdentifier
            );
            var resolveIdentifier = createResolveIdentifier(
                walkPath,
                servicePrefix,
                tagPrefix,
                splitIdentifier
            );
            var resolver = createResolver(resolveIdentifier, traverse);
            var resolveArguments = resolver("arguments");

            var importable = importer(System_import);
            var callable = callabled(loadAndEval, resolveArguments);
            var filterable = filtered(loadAndEval, resolveArguments);

            container.set(
                root + ".loadAndEval",
                function()
                {
                    return loadAndEval;
                }
            );
            container.set(
                root + ".require",
                function()
                {
                    return System_import;
                }
            );
            container.set(
                root + ".walkPath",
                function()
                {
                    return walkPath;
                }
            );
            container.set(
                root + ".resolveIdentifier",
                function()
                {
                    return resolveIdentifier
                }
            );
            container.set(
                root + ".resolver",
                function()
                {
                    return resolver;
                }
            );
            container.set(
                root + ".traverse",
                function()
                {
                    return traverse;
                }
            );
            container.set(
                root + ".resolve.arguments",
                function()
                {
                    return resolveArguments;
                }
            );
            container.set(
                root + ".filter.callable",
                function()
                {
                    return callable;
                }
            );
            
            return function(container, definition, id, definitions)
            {
                var args = arguments;
                return importable.apply(null, arguments).then(
                    function(defs)
                    {
                        definitions = defs || definitions;
                        callable(container, definitions[id], id, definitions);
                        filterable(container, definitions[id], id, definitions);
                        return definitions;
                    }
                );
            }
        }
    );
}
