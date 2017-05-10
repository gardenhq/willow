const helpers = require("../../helpers");
const expect = helpers.expect;
const root = "../../../";

const promised = require(`${root}util/promised`);
describe(
    'filters/object',
    function()
    {
        context(
            ">",
            function()
            {
                const config = {
                    "simple.object": {
                        "object": "./test/fixtures/TestClass"
                    },
                    "complex.object": {
                        "object": "./test/fixtures/TestObject:analytics"
                    },
                    "deep.complex.object": {
                        "object": "./test/fixtures/TestObject:drive.up.to.the.top"
                    }
                };
                var load;
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
                it(
                    "resolves a simple object",
                    function()
                    {
                        return load.then(
                            function(container)
                            {
                                return container.get("simple.object").then(
                                    function(service)
                                    {
                                        expect(service).is.a("function");
                                        expect(service.name).to.equal("TestClass");
                                    }
                                );

                            }
                        );
                    }
                );
                it(
                    "resolves a complex object",
                    function()
                    {
                        return load.then(
                            function(container)
                            {
                                return container.get("complex.object").then(
                                    function(service)
                                    {
                                        expect(service).to.equal("analytics");
                                    }
                                );

                            }
                        );

                    }
                );
                it(
                    "resolves a deep complex object",
                    function()
                    {
                        return load.then(
                            function(container)
                            {
                                return container.get("deep.complex.object").then(
                                    function(service)
                                    {
                                        expect(service).to.equal("drive up to the top");
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






