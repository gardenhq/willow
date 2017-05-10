const helpers = require("../../helpers");
const expect = helpers.expect;
const td = helpers.td;
const root = "../../../";

const container = td.object(require(`${root}Container`));
describe(
    'filters/resolve',
    function()
    {
        const filtered = require(`${root}filters/resolve`);
        afterEach(
            function()
            {
                td.reset();
            }
        );
        it(
            "returns a function given a container-like object",
            function()
            {
                const resolver = td.when(td.function()(td.matchers.anything(), td.matchers.anything())).thenResolve([]);
                const filter = filtered(resolver);
                expect(filter).to.be.a("function");
            }
        );
        it(
            "parses and sets correctly",
            function()
            {
                const resolver = td.when(td.function()(td.matchers.anything(), td.matchers.anything())).thenResolve([]);
                const filter = filtered(resolver);
                const definition = {
                    "service": function(c)
                    {
                        return 1;
                    },
                    "resolve": ["@service.to.be.resolved", "plain string, really should be specific to arguments"]
                };
                filter(
                    container,
                    definition,
                    "namespace.service"
                );
                expect(definition.service).to.equal(null);
                expect(container.set).to.have.been.called;
            }
        );

    }
);




