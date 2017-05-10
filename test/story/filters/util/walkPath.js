const helpers = require("../../../helpers");
const expect = helpers.expect;
const root = "../../../../";

const walkPath = require(`${root}filters/util/walkPath`);
describe(
    'filters/util/walkPaths',
    function()
    {
        context(
            ">",
            function()
            {
                it(
                    "can walk down object paths",
                    function()
                    {
                        const value = {
                            analytics: 1,
                            drive: {
                                down: 0,
                                up: {
                                    to: {
                                        the: "top"
                                    }
                                }
                            }
                        };
                        expect(walkPath("analytics", value)).to.equal(1);
                        expect(walkPath("drive.down", value)).to.equal(0);
                        expect(walkPath("drive.up.to.the", value)).to.equal("top");
                    }
                )

            }
        )

    }
);







