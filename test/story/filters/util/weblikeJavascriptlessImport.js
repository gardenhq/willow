const helpers = require("../../../helpers");
const expect = helpers.expect;
const root = "../../../../";

const getImport = require(`${root}filters/util/weblikeJavascriptlessImport.js`);
describe(
    'filters/util/weblikeJavascriptlessImport',
    function()
    {
        const testFixtures = function(fixtures)
        {
            Object.keys(fixtures).forEach(
                function(key)
                {
                    const _import = getImport(
                        function(path)
                        {
                            expect(path).to.equal(fixtures[key]);
                        }
                    );
                    _import(key)

                }
            );

        }
        it(
            "adds index.js to a folder (something/)",
            function()
            {
                testFixtures(
                    {
                        "/something/": "/something/index.js",
                        "something/": "something/index.js",
                        "../": "../index.js",
                        "./": "./index.js",
                        "/": "/index.js",
                        "js/": "js/index.js",
                        "js/#hash": "js/index.js#hash" 
                    } 
                );
            }
        );
        it(
            "adds .js to a file without a . in it (something/index)",
            function()
            {
                testFixtures(
                    {
                        "/something/index": "/something/index.js",
                        "something/index": "something/index.js",
                        "/index": "/index.js",
                        "js/index": "js/index.js",
                        "anything/somewhere": "anything/somewhere.js",
                        "./anything": "./anything.js",
                        "../anything": "../anything.js"
                    } 
                );
            }
        );
        it(
            "ignores root node modules for compatibility, but amends files within",
            function()
            {
                testFixtures(
                    {
                        "something": "something",
                        "@something/index": "@something/index",
                        "something/index": "something/index.js",
                        "@something/somewhere/js/index": "@something/somewhere/js/index.js"
                    } 
                );
            }
        );
        it(
            "deals with hashes properly",
            function()
            {
                testFixtures(
                    {
                        "/something/#hash": "/something/index.js#hash",
                        "something/#hash": "something/index.js#hash",
                        "../#hash": "../index.js#hash",
                        "./#hash": "./index.js#hash",
                        "/#hash": "/index.js#hash",
                        "js/#hash": "js/index.js#hash",
                        "js/#hash": "js/index.js#hash" ,
                        "something#hash": "something#hash",
                        "@something/index#hash": "@something/index#hash",
                        "something/index#hash": "something/index.js#hash",
                        "@something/somewhere/js/index#hash": "@something/somewhere/js/index.js#hash",
                        "../anything#hash": "../anything.js#hash"
                    } 
                );
            }
        );
    }
);


