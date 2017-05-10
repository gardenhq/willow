const helpers = require("../../helpers");
const expect = helpers.expect;
const root = "../../../";

const promised = require(`${root}util/promised`);
describe(
    'filters/iterator',
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
        context(
            ">",
            function()
            {

                const config = {
                    "iterator.service": {
                        "iterator": "@iterator.function",
                        "arguments": [
                            [
                                1,
                                2,
                                3
                            ]
                        ]
                    },
                    "iterator.function": {
                        "service": function()
                        {
                            return function(value, key)
                            {
                                return value;
                            }
                        }
                    }
                };
                it(
                    "iterates",
                    function()
                    {
                        return load.then(
                            function(container)
                            {
                                return container.build(config).get("iterator.service").then(
                                    function(service)
                                    {
                                        expect(service).to.deep.equal([1, 2, 3])
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






