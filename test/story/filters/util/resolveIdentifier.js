const helpers = require("../../../helpers");
const expect = helpers.expect;
const root = "../../../../";

const resolveIdentifier = require(`${root}filters/util/resolveIdentifier`);
describe(
    'filters/util/resolveIdentifier',
    function()
    {
        context(
            ">",
            function()
            {
                const resolve = resolveIdentifier(null, "@", "#", ":");
                it(
                    "can walk down object paths",
                    function()
                    {
                        expect(resolve("${PROJECT}")).to.equal("gardenhq-willow");
                    }
                )

            }
        )

    }
);








