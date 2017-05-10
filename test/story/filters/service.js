const helpers = require("../../helpers");
const expect = helpers.expect;
const root = "../../../";

const container = new (require(`${root}Container`))();
describe(
    'filters/service',
    function()
    {
        const filtered = require(`${root}filters/service`);
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
                //story
                filter(
                    container,
                    definition,
                    "namespace.service"
                );
                expect(container.get("namespace.service")).to.equal(1);
            }
        );

    }
);





