const helpers = require("../../../helpers");
const expect = helpers.expect;
const root = "../../../../";

const splitIdentifier = require(`${root}filters/util/splitIdentifier`)(":");
describe(
    'filters/util/splitIdentifier',
    function()
    {
        context(
            ">",
            function()
            {
                it(
                    "splits the identifier, when using a simple module:path path, single depth",
                    function()
                    {
                        const identifier = "module:path";
                        const result = splitIdentifier(identifier);
                        expect(result.file).to.equal("module");
                        expect(result.path).to.equal("path");
                    }
                )
                it(
                    "splits the identifier, when using a simple module:path path",
                    function()
                    {
                        const identifier = "module:deeper.path.in";
                        const result = splitIdentifier(identifier);
                        expect(result.file).to.equal("module");
                        expect(result.path).to.equal("deeper.path.in");
                    }
                )
                it(
                    "splits the identifier, when using a simple @org/module:path path",
                    function()
                    {
                        const identifier = "@org/module:deeper.path.in";
                        const result = splitIdentifier(identifier);
                        expect(result.file).to.equal("@org/module");
                        expect(result.path).to.equal("deeper.path.in");
                    }
                )
                it(
                    "splits the identifier, when using a file path ./module/path/index.js:path path",
                    function()
                    {
                        const identifier = "./module/path/index.js:deeper.path.in";
                        const result = splitIdentifier(identifier);
                        expect(result.file).to.equal("./module/path/index.js");
                        expect(result.path).to.equal("deeper.path.in");
                    }
                )
                it(
                    "splits the identifier, when using a remote path with a protocol https://somethingwhere.com/module/path/index.js:path path",
                    function()
                    {
                        const identifier = "https://somethingwhere.com/module/path/index.js:deeper.path.in";
                        const result = splitIdentifier(identifier);
                        expect(result.file).to.equal("https://somethingwhere.com/module/path/index.js");
                        expect(result.path).to.equal("deeper.path.in");
                    }
                )


            }
        )

    }
);







