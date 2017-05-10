const helpers = require("../helpers");
const expect = helpers.expect;
const td = helpers.td;
const root = "../../";

describe(
    'Builder',
    function()
    {
        const Builder = require(`${root}Builder`);
        const Container = require(`${root}Container`);
        var createBuilderWithContainer = function(container, promisedRequire)
        {
            container = container || td.object(Container);
            return new Builder(container, promisedRequire);
        }
        var createBuilderWithFilter = function(filter)
        {
            filter = filter || td.when(td.function("aFilter")()).thenReturn(function(){});
            var builder = createBuilderWithContainer();
            builder.use(filter);
            return builder;
        }
        var createFilter = function()
        {
            return td.when(td.function("aFilter")()).thenReturn(function(){});
        }
        afterEach(
            function()
            {
                td.reset();
            }
        );
        context(
            "Builder Container Proxies",
            function()
            {
                it(
                    "getContainer() returns the container",
                    function()
                    {
                        var container = td.object(Container);
                        var builder = createBuilderWithContainer(container);
                        expect(builder.getContainer()).to.deep.equal(container);
                    }
                );
                it(
                    "has() calls container.has()",
                    function()
                    {
                        var container = td.object(Container);
                        var builder = createBuilderWithContainer(container);
                        builder.has("identifier")
                        expect(container.has).to.have.been.calledTimes(1);
                    }
                );
                it(
                    "!!! set() calls container.set()",
                    function()
                    {
                        var container = td.object(Container);
                        var builder = createBuilderWithContainer(container);
                        builder.set("identifier", 1);
                        expect(container.set).to.have.been.calledTimes(1);
                    }
                );
                it(
                    "tag() calls container.tag()",
                    function()
                    {
                        var container = td.object(Container);
                        var builder = createBuilderWithContainer(container);
                        builder.tag("name", "value", {})
                        expect(container.tag).to.have.been.calledTimes(1);
                    }
                );
                it(
                    "getTagged() calls container.getTagged()",
                    function()
                    {
                        var container = td.object(Container);
                        var builder = createBuilderWithContainer(container);
                        builder.getTagged("tag")
                        expect(container.getTagged).to.have.been.calledTimes(1);
                    }
                );

            }
        );
        context(
            "Builder.use",
            function()
            {
                it(
                    "is called with the correct arguments when building",
                    function()
                    {
                        var builder = createBuilderWithContainer();
                        var id = "identifier";
                        var definition = {};
                        var definitions = {};
                        definitions[id] = definition;
                        var filter = createFilter();
                        builder.use(filter);
                        builder.build(
                            definitions
                        );
                        expect(filter).to.have.been.calledWith(builder, definition, id, definitions);
                    }
                );
                it(
                    "can be called with an array of filters",
                    function()
                    {
                        var builder = createBuilderWithContainer();
                        var id = "identifier";
                        var definition = {};
                        var definitions = {};
                        definitions[id] = definition;
                        var filter = createFilter();
                        builder.use(
                            [filter]
                        );
                        builder.build(
                            definitions
                        );
                        expect(filter).to.have.been.calledWith(builder, definition, id, definitions);
                    }
                );

            }
        );
        context(
            "Builder.clear",
            function()
            {
                var builder = createBuilderWithContainer();
                var filter = createFilter();
                builder.use(filter);
                var b2 = builder.clear();
                return it(
                    "returns builder instance",
                    function()
                    {
                        return expect(b2).to.deep.equal(builder);
                    }
                );
                return it(
                    "clears all the filters (filters therefore won't be called)",
                    function()
                    {
                        builder.build(
                            {
                                "id": {}
                            }
                        );
                        return expect(filter).to.have.been.calledTimes(0);
                    }
                );

            }
        );
        context(
            "Builder.build",
            function()
            {
                it(
                    "returns the builder instance",
                    function()
                    {
                        var builder = createBuilderWithFilter();
                        var b2 = builder.build({});
                        expect(b2).to.deep.equal(builder);
                    }
                );
                it.skip(
                    "proxies to Builder.load",
                    function()
                    {
                    }
                );
            }
        );
        context(
            "Builder.load",
            function()
            {
                var expectRejection = function(promise)
                {
                    return promise.then(
                        function()
                        {
                            throw new Error("Not called");
                        }
                    ).catch(
                        function(e)
                        {
                            expect(e).to.be.an("Error");
                            expect(e.message).to.not.equal("Not called")
                        }
                    );
                }
                it(
                    "returns a promise",
                    function()
                    {
                        var builder = createBuilderWithFilter();
                        var promise = builder.load({});
                        return expect(promise).to.be.a("Promise");
                    }
                );
                it(
                    "returns a promise loading a {}",
                    function()
                    {
                        var builder = createBuilderWithContainer();
                        var promise = builder.load({});
                        return expect(promise).to.be.a("Promise");

                    }
                );
                it(
                    "returns a promise loading a function returning an object",
                    function()
                    {
                        var builder = createBuilderWithContainer();
                        var promise = builder.load(
                            function()
                            {
                                return {};
                            }
                        );
                        return expect(promise).to.be.a("Promise");

                    }
                );
                it(
                    "returns a promise loading a Promise resolving to an object",
                    function()
                    {
                        var builder = createBuilderWithContainer();
                        var promise = builder.load(
                            Promise.resolve({}) 
                        );
                        return expect(promise).to.be.a("Promise");
                    }
                );
                it(
                    "returns a promise loading a function returning a Promise resolving to an object",
                    function()
                    {
                        var builder = createBuilderWithContainer();
                        var promise = builder.load(
                            function()
                            {
                                return Promise.resolve({});
                            }
                        );
                        return expect(promise).to.be.a("Promise");
                    }
                );
                it(
                    "throws an error if the loaded thing isn't an object",
                    function()
                    {
                        var builder = createBuilderWithContainer();
                        var promise = builder.load(
                            function()
                            {
                                return Promise.resolve();
                            }
                        );
                        return expectRejection(promise);
                    }
                );
                context(
                    "when called with a string",
                    function()
                    {
                        var createBuilderThatCanLoad = function(resolveWith)
                        {
                            resolveWith = resolveWith || {};    
                            var container = td.object(Container);
                            var promisedRequire = td.when(
                                td.function("promisedRequire")(td.matchers.anything())
                            ).thenResolve(
                                resolveWith
                            );
                            return createBuilderWithContainer(container, promisedRequire);

                        }
                        it(
                            "throws an error if it doesn't know how to load (nothing tagged)",
                            function()
                            {
                                var builder = createBuilderWithFilter();
                                var load = builder.load.bind(builder, "services.js");
                                expect(load).to.throw("This builder doesn't know how to load");

                            }
                        );
                        // it(
                        //  "throws an error if it doesn't know how to load (nothing tagged)",
                        //  function()
                        //  {
                        //      var builder = createBuilderThatCanLoad(true);
                        //      var load = builder.load.bind(builder, "services.js");
                        //      expect(load).to.throw("This builder doesn't know how to load");

                        //  }
                        // );
                        it(
                            "returns a promise when it knows how to load",
                            function()
                            {
                                var builder = createBuilderThatCanLoad();
                                var promise = builder.load("services.js");
                                return expect(promise).to.be.a("Promise");

                            }
                        );

                    }
                );
            }
        );
        context(
            "Builder.get",
            function()
            {
                var builder = createBuilderWithContainer();
                var filter = createFilter();
                builder.use(filter);
                var id = "identifier";
                var definition = {
                    "service": function()
                    {
                        return "hi";
                    }
                };
                var definitions = {};
                definitions[id] = definition;
                builder.build(
                    definitions
                );
                it(
                    "returns a promise",
                    function()
                    {
                        var promise = builder.get("indentifier");
                        return expect(promise).to.be.a("Promise");
                    }
                );
                it(
                    "is still a promise",
                    function()
                    {
                        var promise = builder.get("indentifier");
                        return expect(promise).to.be.a("Promise");
                    }
                );
            }
        );
        context(
            "Builder.run",
            function()
            {
                var createBuilderThatCanBeRun = function(runnable)
                {
                    var container = td.object(Container);
                    container.get = td.when(
                        td.function("get")(td.matchers.anything())
                    ).thenReturn(
                        runnable
                    );
                    return createBuilderWithContainer(container);

                }
                it(
                    "test run",
                    function()
                    {
                        var runnable = td.function("runnable");
                        var builder = createBuilderThatCanBeRun(
                            runnable
                        )
                        
                        return builder.build({}).run("identifier").then(
                            function()
                            {
                                expect(runnable).to.have.been.calledTimes(1)
                            }
                        );
                    }
                );
            }
        );
    }
);





