/**
 * Modified version of pimple js tests, used under the below license.
 *
 * Copyright (c) 2016, Milos Tomic
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
const helpers = require("../helpers");
const expect = helpers.expect;
const td = helpers.td;
const root = "../../";

describe(
    'Container',
    function()
    {
        const Container = require(`${root}Container`);
        afterEach(
            function()
            {
                td.reset();
            }
        );
        it(
            "throws an error if you try to override and instantiated service",
            function()
            {
                var c = new Container();
                c.set("a", 1);
                c.get("a");
                expect(function(){c.set("a", 2);}).to.throw(Error);
            }
        );
        it(
            "throws an error if you try to get a non-existent service",
            function()
            {
                var c = new Container();
                c.set("a", 1);
                expect(function(){c.get("b");}).to.throw(Error);
            }
        );
        it.skip(
            "throws an error if you try to tag a non-existent service",
            function()
            {
                var c = new Container();
                expect(function(){c.tag("a", "tag");}).to.throw(Error);
            }
        );
        it(
            "throws an error if you set a factory that isn't a callable",
            function()
            {
                var c = new Container();
                expect(function(){c.factory("b", 1);}).to.throw(Error);
            }
        );
        it('should instantiate w/out arguments', function () {
            var p = new Container()
            expect(p).to.be.an('object')
        })

        it('should instantiate w/ object argument', function () {
            var p = new Container({a: 1, b: 2})
            expect(p).to.be.an('object')
        })

        it('should set value definition', function () {
            var p = new Container()
            p.set('a', 1)
        })

        it('should set closure definition', function () {
            var p = new Container()
            p.set('a', function (c) {
                return 1
            })
        })

        it('should get defined value', function () {
            var p = new Container()
            p.set('a', 3)
            expect(p.get('a')).to.equal(3)
        })

        it('should get defined closure', function () {
            var p = new Container()
            p.set('a', function (c) {
                expect(c).to.equal(undefined);
                expect(this).to.equal(p)
                return 3
            })
            expect(p.get('a')).to.equal(3)
        })

        it('should call definition closure only once', function () {
            var p = new Container()
            var count = 0
            p.set('a', function (c) {
                count++
                return 3
            })
            expect(p.get('a')).to.equal(3)
            expect(p.get('a')).to.equal(3)
            expect(p.get('a')).to.equal(3)
            expect(count).to.equal(1)
        })

        it('should get defined factory', function () {
            var p = new Container()
            p.factory('a', function (c) {
                expect(c).to.equal(p)
                return 3
            })
            expect(p.get('a')).to.equal(3)
        })

        it('should call factory closure each time', function () {
            var p = new Container()
            var count = 0
            p.factory('a', function (c) {
                count++
                return 3
            })
            expect(p.get('a')).to.equal(3)
            expect(p.get('a')).to.equal(3)
            expect(p.get('a')).to.equal(3)
            expect(count).to.equal(3)
        })

        it('should tag service', function () {
            var p = new Container()
            p.set('a', 1)
            p.tag('a', 'tag1', {})
            expect(p.getTagged('tag1')).to.deep.equal([1]);
        })
        it('should tag multiple services', function () {
            var p = new Container()
            p.set('a', 1)
            p.set('b', 2)
            p.tag('a', 'tag1', {})
            p.tag('b', 'tag1', {})
            expect(p.getTagged('tag1')).to.deep.equal([1, 2]);
        })

        it('should support multiple tags', function () {
            var p = new Container()
            p.set('a', 1)
            p.set('b', 2)
            p.tag('a', 'tag1', {})
            p.tag('a', 'tag1', {})
            p.tag('a', 'tag2', {})
            expect(p.getTagged('tag1')).to.deep.equal([1])
        })
        it(
            "removes tags when a service is overwritten",
            function()
            {
                var c = new Container();
                c.set("a", 1);
                c.tag('a', 'tag1', {});
                c.set("a", 2);
                expect(c.getTagged('tag1')).to.deep.equal([]);
            }
        );
        it(
            "returns an empty object if findTaggedIds doesn't find any",
            function()
            {
                var c = new Container();
                c.set("a", 1);
                c.tag('a', 'tag1', {});
                c.set("a", 2);
                expect(c.findTaggedIds("tag2")).to.deep.equal({});
            }
        );
    }
);





