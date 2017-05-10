const helpers = require("../../helpers");
const expect = helpers.expect;
const root = "../../../";

const promised = require(`${root}util/promised`);
describe(
    'filters/imports',
    function()
    {
        var load;
        before(
            function()
            {
                load = promised(require)(`${root}`).then(
                    function(builder)
                    {
                        return builder();
                    }
                );
                return load;
            }
        );
        context(
            "import as a promise",
            function()
            {

                const config = {
                    "imports": [
                        {
                            resource: "./test/fixtures/container.promise.js"
                        }
                    ],
                    "simple.class.promise": {
                        "arguments": [
                            "d",
                            "e",
                            "f"
                        ]
                    }
                };
                it(
                    "imports and overwrites",
                    function()
                    {
                        return load.then(
                            function(container)
                            {
                                return container.build(config).get("simple.class.promise").then(
                                    function(service)
                                    {
                                        expect(service.txt).to.equal("d");
                                    }
                                );

                            }
                        );
                    }
                );
            }
        );
        context(
            "import as an object",
            function()
            {

                const config = {
                    "imports": [
                        {
                            resource: "./test/fixtures/container.object.js"
                        }
                    ],
                    "simple.class.object": {
                        "arguments": [
                            "d",
                            "e",
                            "f"
                        ]
                    }
                };
                it(
                    "imports and overwrites",
                    function()
                    {
                        return load.then(
                            function(container)
                            {
                                return container.build(config).get("simple.class.object").then(
                                    function(service)
                                    {
                                        expect(service.txt).to.equal("d");
                                    }
                                );

                            }
                        );
                    }
                );
            }
        );
        context(
            "import as a callable",
            function()
            {
                const config = {
                    "imports": [
                        {
                            resource: "./test/fixtures/container.js"
                        }
                    ],
                    "tagged.number": {
                        "tags": [
                            "tagged"
                        ]
                    },
                    "simple.class": {
                        "arguments": [
                            "d",
                            "e",
                            "#tagged"
                        ]
                    }
                };
                it(
                    "imports and overwrites inc tags",
                    function()
                    {
                        return load.then(
                            function(container)
                            {
                                return container.build(config).get("simple.class").then(
                                    function(service)
                                    {
                                        expect(service.txt).to.equal("d");
                                        expect(service.tagged[0]).to.equal(1);
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






