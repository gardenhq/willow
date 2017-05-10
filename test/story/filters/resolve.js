const helpers = require("../../helpers");
const expect = helpers.expect;
const root = "../../../";

const promised = require(`${root}util/promised`);
const name = "willow"
describe(
    'filters/resolve',
    function()
    {
        var load;
        before(
            function()
            {
                load = promised(require)(`${root}`).then(
                    function(builder)
                    {
                        return builder();
                    }
                );
                return load;
            }
        );
        it(
            "can resolve a promise before getting a service",
            function()
            {
                return load.then(
                    function(container)
                    {
                        const definition = {
                            "resolve": ["@needs.resolving", "not a service"],
                            "service": function()
                            {
                                return 1 + new Number(this.get("needs.resolving"));
                            }
                        };
                        container.set(
                            "needs.resolving",
                            function()
                            {
                                return new Promise(
                                    function(resolve, reject)
                                    {
                                        resolve(2);
                                    }
                                );
                            }
                        );
                        return Promise.all(
                            [
                                container.get(name + ".filter.resolve")
                            ]
                        ).then(
                            function(services)
                            {
                                const filter = services[0];
                                filter(
                                    container,
                                    definition,
                                    "namespace.service"
                                );
                                return container.get("namespace.service").then(
                                    function(service)
                                    {
                                        expect(service).to.equal(3);
                                    }
                                );

                            }
                        );

                    }
                );
            }
        );

    }
);





