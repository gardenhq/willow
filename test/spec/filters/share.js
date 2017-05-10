const helpers = require("../../helpers");
const expect = helpers.expect;
const td = helpers.td;
const root = "../../../";

const container = td.object(require(`${root}Container`));
describe(
    'filters/shared',
    function()
    {
        const filtered = require(`${root}filters/shared`);
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
            "parse and shares correctly, without calling set",
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
                    {
                        "service": service,
                        "shared": false
                    },
                    "namespace.service"
                );
                expect(container.factory).to.have.been.calledWith("namespace.service", service);
                expect(container.set).not.to.have.been.called;
            }
        );

    }
);



