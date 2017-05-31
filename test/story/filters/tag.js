const helpers = require("../../helpers");
const expect = helpers.expect;
const root = "../../../";

const container = new (require(`${root}Container`))();
describe(
    'filters/tag',
    function()
    {
        const filtered = require(`${root}filters/tags`);
        it(
            "parses and sets correctly",
            function()
            {
                const filter = filtered();
                const definition = {
                    "service": function()
                    {
                        return 1;
                    },
                    "tags": [
                        {
                            name: "tag.name",
                            key: "name"
                        }
                    ]
                };
                //story
                filter(
                    container,
                    definition,
                    "namespace.service"
                );
                console.log(container.getTagged("tag.name"));
                // expect(container.get("namespace.service")).to.equal(1);
            }
        );

    }
);





