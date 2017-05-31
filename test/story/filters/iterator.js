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
            "with plain arrays",
            function()
            {
                const arr = [
                    1, 2, 3
                ];
                const config = {
                    "iterator.service.array": {
                        "iterator": "@iterator.function.array",
                        "arguments": [
                            arr     
                        ]
                    },
                    "iterator.function.array": {
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
                    "iterates arrays",
                    function()
                    {
                        return load.then(
                            function(builder)
                            {
                                return builder.build(config).get("iterator.service.array").then(
                                    function(service)
                                    {
                                        expect(service).to.deep.equal(arr);
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
        context(
            "with objects and keys",
            function()
            {
                const obj = {name: "hi"};
                const config = {
                    "tagged": {
                        "service": function()
                        {
                            return obj
                        },
                        "tags": [
                            {
                                name: "tag.name",
                                key: "key"
                            }
                        ]
                    },
                    "iterator.service.object": {
                        "iterator": "@iterator.function.object",
                        "arguments": [
                             "#tag.name"
                        ]
                    },
                    "iterator.function.object": {
                        "service": function()
                        {
                            return function(value, key)
                            {
                                expect(key).to.equal("key");
                                return value;
                            }
                        }
                    }
                };
                it(
                    "iterates objects",
                    function()
                    {
                        return load.then(
                            function(builder)
                            {
                                return builder.build(config).get("iterator.service.object").then(
                                    function(service)
                                    {
                                        expect(service).to.deep.equal({key: obj})
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






