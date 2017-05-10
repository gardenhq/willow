const helpers = require("../../../../helpers");
const expect = helpers.expect;
const root = "../../../../../";
const fs = require("fs");

var promised = require(`${root}util/promised`);
describe(
    'filters/loader/paths',
    function()
    {
        var load;
        context(
            "Using an npm 'org' path (@org/module)",
            function()
            {
                const path = "@gardenhq/test/index.js";
                const config = {
                    "org.object": {
                        "object": path
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
                it.skip(
                    "loads the path properly",
                    function()
                    {
                        const actual = require(path);
                        return load.then(
                            function(container)
                            {
                                return container.get("org.object").then(
                                    function(service)
                                    {
                                        expect(service).to.equal(actual);
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





