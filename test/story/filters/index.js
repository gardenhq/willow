var should = require('should');
var expect = require("../../helpers.js").expect;
var promised = require("../../../util/promised");
describe(
    'filters',
    function()
    {
        var load;
        before(
            function()
            {
                load = promised(require)("../../../index");
                return load;
            }
        );
        context(
            "classes",
            function()
            {
                const config = {
                    "a.class": {
                        "class": "./test/fixtures/TestClass",
                        "arguments": [
                            "hi"
                        ]
                    },
                    "tagged.value": {
                        "service": function()
                        {
                            return "value";
                        },
                        "tags": ["tagged"]
                    },
                    "tagged.class": {
                        "class": "./test/fixtures/TestClass",
                        "arguments": [
                            "@tagged.value",
                            "cls should be here",
                            "tagged should be here"
                        ],
                        "tags": ["tagged"]
                    },
                    "tagged.arguments": 
                    {
                        "class": "./test/fixtures/TestClass",
                        "arguments": [
                            "@tagged.value",
                            "@tagged.class",
                            "#tagged"
                        ]
                    },
                    "promise": {
                        "service": function()
                        {
                            return Promise.resolve("hiii");

                        }
                    },
                    "test.callable": {
                        "callable": "./test/fixtures/testCallable",
                        "arguments": [
                            "hi",
                            "there"
                        ]
                    },
                    "test.null": null,
                    "test.object": new Array("non-plain")

                };


                it(
                    "gets simple values",
                    function()
                    {
                        return load.then(
                            function(builder)
                            {
                                return builder().then(
                                    function(builder)
                                    {
                                        return builder.build(
                                            config
                                        ).get("tagged.value").then(
                                            function(value)
                                            {
                                                value.should.equal("value");
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
                it(
                    "gets null values",
                    function()
                    {
                        return load.then(
                            function(builder)
                            {
                                return builder().then(
                                    function(builder)
                                    {
                                        return builder.build(
                                            config
                                        ).get("test.null").then(
                                            function(args)
                                            {
                                                (args === null).should.equal(true);
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
                it(
                    "gets non plain object values",
                    function()
                    {
                        return load.then(
                            function(builder)
                            {
                                return builder().then(
                                    function(builder)
                                    {
                                        return builder.build(
                                            config
                                        ).get("test.object").then(
                                            function(args)
                                            {
                                                args[0].should.equal("non-plain");
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
                it(
                    "gets callables",
                    function()
                    {
                        return load.then(
                            function(builder)
                            {
                                return builder().then(
                                    function(builder)
                                    {
                                        return builder.build(
                                            config
                                        ).get("test.callable").then(
                                            function(args)
                                            {
                                                (args[0]).should.equal("hi");
                                                (args[1]).should.equal("there");
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
                it(
                    "gets classes",
                    function()
                    {
                        return load.then(
                            function(builder)
                            {
                                return builder().then(
                                    function(builder)
                                    {
                                        return builder.build(
                                            config
                                        ).get("a.class").then(
                                            function(result)
                                            {
                                                (result.txt).should.equal("hi");
                                            }
                                        );
                                    }
                                );
                            }
                        );

                    }
                );
                it(
                    "gets classes with tagged arguments",
                    function()
                    {
                        return load.then(
                            function(builder)
                            {
                                return builder().then(
                                    function(builder)
                                    {
                                        return builder.build(
                                            config
                                        ).get("tagged.arguments").then(
                                            function(result)
                                            {
                                                (result.txt).should.equal("value");
                                            }
                                        );
                                    }
                                );
                            }
                        );

                    }
                );
            }
        );
        context(
            "Promised",
            function()
            {
                const config = {
                    "promised": 
                    {
                        "service": function()
                        {
                            return new Promise(
                                function(resolve, reject)
                                {
                                    setTimeout(
                                        function()
                                        {
                                            resolve("hi");
                                        },
                                        200
                                    );
                                }
                            );
                        }
                    },
                    "another.promised": 
                    {
                        "service": function()
                        {
                            return new Promise(
                                function(resolve, reject)
                                {
                                    setTimeout(
                                        function()
                                        {
                                            resolve("again");
                                        },
                                        500
                                    );
                                }
                            );
                        }
                    },
                    "made.of.promises": {
                        "resolve": [
                            "@promised",
                            "@another.promised"
                        ],
                        "service": function(promised, another)
                        {
                            // return promised + " there " + another;
                            return this.get("promised") + " there " + this.get("another.promised");
                        }
                    }
                };
                it(
                    "uses promises (has a 500ms timeout)",
                    function()
                    {
                        return load.then(
                            function(builder)
                            {
                                return builder();
                            }
                        ).then(
                            function(builder)
                            {
                                const container = builder.build(config);
                                return Promise.all(
                                    [
                                        container.get("promised"),
                                        container.get("made.of.promises")
                                    ]
                                ).then(
                                    function(services)
                                    {
                                        services[0].should.equal("hi");
                                        services[1].should.equal("hi there again");
                                    }
                                );

                            }
                        );
                    }
                );
            }
        );

    }
);
