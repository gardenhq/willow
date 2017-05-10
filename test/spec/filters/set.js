const helpers = require("../../helpers");
const expect = helpers.expect;
const td = helpers.td;
const root = "../../../";

const container = td.object(require(`${root}Container`));
describe(
    'filters/set',
    function()
    {
        const filtered = require(`${root}filters/set`);
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
                var count = 0;
                var service = function()
                {
                    count ++;
                    return count;
                };
                filter(
                    container,
                    1,
                    "@namespace.service"
                );
                expect(container.set).to.have.been.calledWith("namespace.service", td.matchers.isA(Function));
                filter(
                    {
                        set: function(key, value)
                        {
                            expect(value()).to.equal(1);
                        }
                    },
                    1,
                    "@namespace.service"
                );
            }
        );

    }
);



