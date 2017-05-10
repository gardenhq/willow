const helpers = require("../../helpers");
const expect = helpers.expect;
const td = helpers.td;
const root = "../../../";

const container = td.object(require(`${root}Container`));
describe(
    'filters/service',
    function()
    {
        const filtered = require(`${root}filters/service`);
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
                const filter = filtered();
                expect(filter).to.be.a("function");
            }
        );
        it(
            "parses and sets correctly",
            function()
            {
                const filter = filtered();
                const definition = {
                    "service": function()
                    {
                        return 1;
                    }
                };
                filter(
                    container,
                    definition,
                    "namespace.service"
                );
                expect(container.set).to.have.been.calledWith("namespace.service", td.matchers.isA(Function));


                //story
                filter(
                    {
                        set: function(key, value)
                        {
                            expect(value).to.be.a("function");
                        }
                    },
                    definition,
                    "namespace.service"
                );
            }
        );

    }
);




