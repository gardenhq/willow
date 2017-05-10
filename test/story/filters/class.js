const helpers = require("../../helpers");
const expect = helpers.expect;
const root = "../../../";

var promised = require(`${root}util/promised`);
describe(
    'filters/class',
    function()
    {
        var load;
        context(
            ">",
            function()
            {

                const config = {
                    "simple.class": {
                        "class": "./test/fixtures/TestClass"
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
                    "notags.arguments": 
                    {
                        "class": "./test/fixtures/TestClass",
                        "arguments": [
                            "value",
                            "cls should be here",
                            "#not-tagged"
                        ]
                    },
                    "calls.class": {
                        "class": "./test/fixtures/TestClass",
                        "arguments": [
                            "@tagged.value",
                            "cls should be here",
                            "tagged should be here"
                        ],
                        "calls": [
                            ["setSomething", [{"property": "@tagged.value", "resolved": "@tagged.class"}]] 
                        ]

                    },
                    "needs.calls.class": {
                        "class": "./test/fixtures/TestClass",
                        "arguments": [
                            "@calls.class",
                            "cls should be here",
                            "@deep.args.class"
                        ]
                    },
                    "deep.args.class": {
                        "class": "./test/fixtures/TestClass",
                        "arguments": [
                            {
                                something: "@tagged.value"
                            }
                        ]

                    }
                };
                before(
                    function()
                    {
                        load = promised(require)(`${root}`).then(
                            function(builder)
                            {
                                return builder();
                            }
                        ).then(
                            function(builder)
                            {
                                return builder.build(config);
                            }
                        );
                        return load;
                    }
                );
                // before(
                //  function()
                //  {

                //      return Promise.resolve(builder.build(config));
                //  }
                // );
                it(
                    "resolves a simple class",
                    function()
                    {
                        load.then(
                            function(container)
                            {
                                return container.get("simple.class").then(
                                    function(service)
                                    {
                                        expect(service.constructor.name).to.equal("TestClass");
                                    }
                                );

                            }
                        );
                    }
                );
                it(
                    "resolves with arguments",
                    function()
                    {
                        load.then(
                            function(container)
                            {
                                return container.get("tagged.class").then(
                                    function(service)
                                    {
                                        expect(service.constructor.name).to.equal("TestClass");
                                        expect(service.txt).to.equal("value");
                                        expect(service.cls).to.equal("cls should be here");
                                        expect(service.tagged).to.equal("tagged should be here");
                                    }
                                );

                            }
                        );
                    }
                );
                it(
                    "resolves with tagged arguments",
                    function()
                    {
                        load.then(
                            function(container)
                            {
                                return container.get("tagged.class").then(
                                    function(service)
                                    {
                                        expect(service.constructor.name).to.equal("TestClass");
                                        expect(service.txt).to.equal("value");
                                        expect(service.cls).to.equal("cls should be here");
                                        expect(service.tagged).to.equal("tagged should be here");
                                    }
                                );

                            }
                        );

                    }
                );
                it(
                    "resolves with tagged arguments when the tag is empty",
                    function()
                    {
                        return load.then(
                            function(container)
                            {
                                return container.get("notags.arguments").then(
                                    function(service)
                                    {
                                        expect(service.constructor.name).to.equal("TestClass");
                                        expect(service.txt).to.equal("value");
                                        expect(service.cls).to.equal("cls should be here");
                                        expect(service.tagged.length).to.equal(0);
                                    }
                                );

                            }
                        );

                    }
                );
                it(
                    "resolves with a method call",
                    function()
                    {
                        load.then(
                            function(container)
                            {
                                return container.get("calls.class").then(
                                    function(service)
                                    {
                                        expect(service.constructor.name).to.equal("TestClass");
                                        expect(service.txt).to.equal("value");
                                        expect(service.cls).to.equal("cls should be here");
                                        expect(service.tagged).to.equal("tagged should be here");
                                        expect(service.something).to.be.an("object");
                                        expect(service.something.property).to.equal("value");
                                        expect(service.something.resolved.constructor.name).to.equal("TestClass");
                                    }
                                );

                            }
                        );

                    }
                );
                it(
                    "resolves something with a method call",
                    function()
                    {
                        load.then(
                            function(container)
                            {
                                return container.get("needs.calls.class").then(
                                    function(service)
                                    {
                                        expect(service.txt.something.resolved.constructor.name).to.equal("TestClass");
                                        expect(service.tagged.txt.something).to.equal("value");
                                    }
                                );

                            }
                        );

                    }
                );
                it(
                    "resolves arguments deeply",
                    function()
                    {
                        load.then(
                            function(container)
                            {
                                return container.get("deep.args.class").then(
                                    function(service)
                                    {
                                        expect(service.txt.something).to.equal("value");
                                        // expect(service.constructor.name).to.equal("TestClass");
                                        // expect(service.txt).to.equal("value");
                                        // expect(service.cls).to.equal("cls should be here");
                                        // expect(service.tagged).to.equal("tagged should be here");
                                        // expect(service.something).to.be.an("object");
                                        // expect(service.something.property).to.equal("value");
                                        // console.log(service.something.resolved);
                                    }
                                );

                            }
                        );

                    }

                );
            }
        )

    }
);





