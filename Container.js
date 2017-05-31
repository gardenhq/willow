/**
 * Default/Reference Container - modified version of pimple js, used under
 * the below license.
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
var utils = {
    isDefined: function(obj)
    {
        return (typeof obj !== "undefined");
    },
    isCallable: function(obj)
    {
        return (typeof obj === "function");
    }
};
var Container = function Container(services)
{
    this._keys = {};
    this._values = {};
    this._factories = [];
    this._definitions = {};
    this._tags = {};
    if (services) {
        Object.keys(
            services
        ).forEach(
            function(service)
            {
                this.set(service, services[service])
            },
            this
        )
    }
    
}
Object.assign(
    Container.prototype,
    {
        set: function(id, value, tags)
        {
            if (utils.isDefined(this._values[id])) {
                throw new Error('Cannot set "' + id + '", it is already set and has been instantiated')
            }
            if(utils.isDefined( this._definitions[id]) && this._definitions[id] !== null) {
                this.removeTags(id);
            }
            this._definitions[id] = value;
            this._keys[id] = true;
            if(tags != null) {
                tags.forEach(
                    function(item, i, arr)
                    {
                        if(typeof item === 'string') {
                            this.tag(id, item);
                        } else {
                            this.tag(id, item.name, item)
                        }
                    },
                    this
                );

            }
            return this;
        },
        tag: function(id, tag, attributes)
        {
            if (!utils.isDefined(this._keys[id])) {
                this.set(id, null);
                // throw new Error('Cannot tag "' + id + '", identifier is not defined');
            }
            if (!utils.isDefined(this._tags[tag])) {
                this._tags[tag] = {};
            }
            if (!utils.isDefined(this._tags[tag][id])) {
                this._tags[tag][id] = [];
            }
            this._tags[tag][id].push(attributes || {});
            return this;
        },
        get: function(id)
        {
            if (!this.has(id)) {
                throw new Error('Cannot get "' + id + '", identifier is not defined');
            }

            if (utils.isDefined(this._values[id])) {
                return this._values[id];
            }
            if (utils.isDefined(this._factories[id])) {
                return this._factories[id](this, []);
            }
            if (utils.isCallable(this._definitions[id])) {
                this._values[id] = this._definitions[id].apply(this, []);
            } else {
                this._values[id] = this._definitions[id];
            }
            return this._values[id];
        },
        has: function(id)
        {
            return utils.isDefined(this._keys[id]);
        },
        factory: function(id, value)
        {
            if (!utils.isCallable(value)) {
                throw new Error('Cannot set "' + id + '", service factories must be callable')
            }
            this._factories[id] = value;
            this._keys[id] = true;

            return this;
        },
        removeTags: function(id)
        {
            if(this.has(id)) {
                Object.keys(
                    this._tags
                ).forEach(
                    function(item, i, arr)
                    {
                        if(this._tags[item][id] != null) {
                            delete this._tags[item][id];
                        }
                    },
                    this
                );
            }
        },
        findTaggedIds: function(tag)
        {
            if (!utils.isDefined(this._tags[tag])) {
                return {};
            }
            return this._tags[tag];
        },
        getTagged: function(tag)
        {
            var tags = this.findTaggedIds(tag);
            var services = [];
            Object.keys(
                tags
            ).forEach(
                function(item, i, arr)
                {
                    var service = this.get(item);
                    var key = tags[item].reduce(
                        function(prev, item, i, arr)
                        {
                            if(item.name != null && item.name == tag) {
                                return item.key;
                            }
                            return prev;
                        },
                        i
                    )
                    services[key] = service;
                },
                this
            );
            return services;
        }
    
    }
);
module.exports = Container;
