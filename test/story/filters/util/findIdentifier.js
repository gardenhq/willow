const helpers = require("../../../helpers");
const expect = helpers.expect;
const root = "../../../../";

const findIdentifier = require(`${root}filters/util/findIdentifier`)("@");
describe(
    'filters/util/findIdentifier',
    function()
    {
        context(
            "doesn't look in the container for",
            function()
            {
                it(
                    "./File.js:deeper.down",
                    function()
                    {
                        const identifier = {
                            file: "./File.js",
                            path: "deeer.down"
                        };
                        const result = findIdentifier(identifier);
                        expect(result).to.equal(false);
                    }
                )
                it(
                    "@org/module/File.js:deeper.down",
                    function()
                    {
                        const identifier = {
                            file: "@org/module/File.js",
                            path: "deeer.down"
                        };
                        const result = findIdentifier(identifier);
                        expect(result).to.equal(false);
                    }
                )
                it(
                    "@org/module",
                    function()
                    {
                        const identifier = {
                            file: "@org/module",
                            path: null
                        };
                        const result = findIdentifier(identifier);
                        expect(result).to.equal(false);
                    }
                )
                it(
                    "@org/module:deeper.down",
                    function()
                    {
                        const identifier = {
                            file: "@org/module",
                            path: "deeper.down"
                        };
                        const result = findIdentifier(identifier);
                        expect(result).to.equal(false);
                    }
                )
            }
        )
        context(
            "looks in the container for",
            function()
            {
                it(
                    "@org",
                    function()
                    {
                        const identifier = {
                            file: "@org",
                            path: null
                        };
                        const result = findIdentifier(identifier);
                        expect(result).to.equal("org");

                    }
                );
                it(
                    "@org:deeper",
                    function()
                    {
                        const identifier = {
                            file: "@org",
                            path: "deeper"
                        };
                        const result = findIdentifier(identifier);
                        expect(result).to.equal("org");

                    }
                );
                it(
                    "@org.module:deeper",
                    function()
                    {
                        const identifier = {
                            file: "@org.module",
                            path: "deeper"
                        };
                        const result = findIdentifier(identifier);
                        expect(result).to.equal("org.module");

                    }
                );
            }
        )

    }
);







