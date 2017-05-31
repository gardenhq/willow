module.exports = function(container)
{ 
    var root = "willow";
    var servicePrefix = "@";
    var tagPrefix = "#";
    var identifierSplitter = ":";

    var System_import = container.get(root + ".system.import");
    var System_resolve = container.get(root + ".system.resolve");
    var System_registerDynamic = container.get(root + ".system.registerDynamic");

    return Promise.all(
        [
            "/util/loader.js",
            "/util/walkPath.js",
            "/util/resolveIdentifier.js",
            "/util/traverse.js",
            "/util/resolver.js",
            "/util/splitIdentifier.js",
            "/util/findIdentifier.js",
            "/util/weblikeJavascriptlessImport.js",

            "/imports.js",
            "/callable.js",
            "/filter.js"
        ].map(
            function(item)
            {
                return __dirname + item;
            }
        ).map(function(item){ return System_import(item) })
    ).then(
        function(modules)
        {
            return (
                function(
                    loader,
                    walkPath,
                    createResolveIdentifier,
                    traverse,
                    createResolver,
                    splitIdentifier,
                    findIdentifier,
                    weblikeJavascriptlessImport,
                    importer,
                    callabled,
                    filtered
                )
                {
                    splitIdentifier = splitIdentifier(identifierSplitter);
                    findIdentifier = findIdentifier(servicePrefix);
                    weblikeJavascriptlessImport = weblikeJavascriptlessImport(System_import);

                    var loadAndEval = loader(
                        weblikeJavascriptlessImport,
                        System_resolve,
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

                    var importable = importer(weblikeJavascriptlessImport);
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

                    return function(builder, definition, id, definitions)
                    {
                        var args = arguments;
                        return importable.apply(null, arguments).then(
                            function(defs)
                            {
                                definitions = defs || definitions;
                                callable(builder, definitions[id], id, definitions);
                                filterable(builder, definitions[id], id, definitions);
                                return definitions;
                            }
                        );
                    }
                }
            ).apply(null, modules);
        }
    );
}
