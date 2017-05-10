var should = require('should');
var expect = require("../helpers.js").expect;
var promised = require("../../util/promised");
var root = "../../";
describe(
    'Builder',
    function()
    {
        const Builder = require(`${root}Builder`);
        const Container = require(`${root}Container`);

        context(
            "checking types",
            function()
            {
                var Klass = function(){}
                var instance = new Klass();
                var builder = new Builder(new Container());
                builder.build(
                    {
                        "a": "foo",
                        "b": true,
                        "c": 1,
                        "d": function()
                        {
                            return "bar";
                        },
                        "e": [],
                        "f": instance,
                        "g": {}
                    }
                )
                it(
                    "gets primitive strings",
                    function()
                    {
                        return builder.get("a").then(
                            function(service)
                            {
                                expect(service).to.equal("foo");
                            }
                        );
                    }
                );
                it(
                    "gets boolean values",
                    function()
                    {
                        return builder.get("b").then(
                            function(service)
                            {
                                expect(service).to.equal(true);
                            }
                        );
                    }
                );
                it(
                    "gets numeric values",
                    function()
                    {
                        return builder.get("c").then(
                            function(service)
                            {
                                expect(service).to.equal(1);
                            }
                        );
                    }
                );
                it(
                    "gets functions",
                    function()
                    {
                        return builder.get("d").then(
                            function(service)
                            {
                                expect(typeof service).to.equal("function");
                                expect(service()).to.equal("bar")
                            }
                        );
                    }
                );
                it(
                    "gets arrays",
                    function()
                    {
                        return builder.get("e").then(
                            function(service)
                            {
                                expect(service instanceof Array).to.equal(true);
                            }
                        );
                    }
                );
                it(
                    "gets Non-Plain objects",
                    function()
                    {
                        return builder.get("f").then(
                            function(service)
                            {
                                expect(service instanceof Klass).to.equal(true);
                            }
                        );
                    }
                );
                it(
                    "cannot get plain object",
                    function()
                    {
                        expect(builder.get("g").then).to.throw();
                    }
                );
            }
        );



        context(
            "multiple calls",
            function()
            {
                it(
                    "builds multiple times",
                    function()
                    {
                        var builder = new Builder(new Container());
                        builder.build(
                            {
                                "a": "foo"
                            }
                        ).build(
                            {
                                "b": "bar"
                            }
                        );
                        return Promise.all(
                            [
                                builder.get("a"),
                                builder.get("b")
                            ]
                        ).then(
                            function(services)
                            {
                                expect(services[0]).to.be.equal("foo");
                                expect(services[1]).to.be.equal("bar");
                            }
                        );
                    }
                );
                it(
                    "gets multiple times",
                    function()
                    {
                        var builder = new Builder(new Container());
                        builder.build(
                            {
                                "a": "foo"
                            }
                        );
                        return Promise.all(
                            [
                                builder.get("a"),
                                builder.get("a")
                            ]
                        ).then(
                            function(services)
                            {
                                expect(services[0]).to.be.equal("foo");
                                expect(services[1]).to.be.equal("foo");
                            }
                        );
                    }
                );

            }
        );
    }
);
