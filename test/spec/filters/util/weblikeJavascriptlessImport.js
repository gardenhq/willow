
const helpers = require("../../../helpers");
const expect = helpers.expect;
const td = helpers.td;
const root = "../../../../";

const container = td.object(require(`${root}Container`));
describe(
    'filters/util/weblikeJavascriptlessImport',
    function()
    {
        const getImport = require(`${root}filters/util/weblikeJavascriptlessImport.js`);
        afterEach(
            function()
            {
                td.reset();
            }
        );
        it(
            "returns a function given a require-like function",
            function()
            {
                const requireDouble = td.function("require")(td.matchers.anything())
                const _import = getImport(requireDouble);
                expect(_import).to.be.a("function");
            }
        );
        it(
            "calls requirelike",
            function()
            {
                const requireDouble = td.when(td.function()(td.matchers.anything())).thenResolve([]);
                const _import = getImport(requireDouble);
                _import("something/");
                expect(requireDouble).to.have.been.calledWith("something/index.js");
                _import("@something");
                expect(requireDouble).to.have.been.calledWith("@something");
                _import("something/index");
                expect(requireDouble).to.have.been.calledWith("something/index.js");
            }
        );
    }
);


