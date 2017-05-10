const helpers = require("../../helpers");
const expect = helpers.expect;
const td = helpers.td;
const root = "../../../";

const container = td.object(require(`${root}Container`));
describe(
    'filters/tags',
    function()
    {
        const tagged = require(`${root}filters/tags`);
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
                const tag = tagged();
                expect(tag).to.be.a("function");
            }
        );
        it(
            "parse and applies tags correctly",
            function()
            {
                const actual = "tag";
                const tag = tagged();
                tag(
                    container,
                    {
                        "tags": [
                            actual
                        ]
                    },
                    "namespace.service"
                );
                expect(container.tag).to.have.been.calledWith("namespace.service", actual, {});
                td.reset();
                tag(
                    container,
                    {
                        "tags": [
                            `${actual}_0`,
                            `${actual}_1`
                        ]
                    },
                    "namespace.service"
                );
                expect(container.tag)
                        .to.have.been.calledWith("namespace.service", `${actual}_0`, {})
                    .and.to.have.been.calledWith("namespace.service", `${actual}_1`, {})
                    .and.to.have.been.calledTimes(2);

            }
        );

    }
);


