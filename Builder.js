var Builder = function Builder(container, promisedRequire)
{
    this.container = container;
    this.loading = null;
    this.import = promisedRequire;
    this.clear();
    // this.container.set(
    //  "this",
    //  function()
    //  {
    //      return this;
    //  }
    // );
}
Object.assign(
    Builder.prototype,
    {
        use: function(filters)
        {
            if(typeof filters === "function") {
                filters = [filters];
            }
            // console.log(this.filters);
            this.filters = this.filters.concat(filters);
            return this;
        },
        clear: function()
        {
            this.filters = [];
            return this;
        },
        get: function(key)
        {
            const container = this.container;
            var service;
            if(this.loading != null) {
                service = this.loading.then(
                    function()
                    {
                        // this.loading = null;
                        return container.get(key);
                    }.bind(this)
                );
            } else {
                service = container.get(key);
            }
            // TODO: Should always be a promise? Unless within a service definition argument?
            if(service instanceof Promise) {
                service.catch(
                    function(e)
                    {
                        // TODO: is there a better way to do this?
                        e.message = e.message + "\n @" + key + "";
                    }
                );
            }   
            return service;
        },
        set: function(key, value)
        {
            this.container.set.apply(this.container, arguments);
            return this;
        },
        has: function(key)
        {
            return this.container.has.apply(this.container, arguments);
        },
        tag: function()
        {
            this.container.tag.apply(this.container, arguments);
            return this;
        },
        getTagged: function(key)
        {
            return this.container.getTagged(key);
        },
        run: function(key, args)
        {
            return this.get(key).then(
                function(service)
                {
                    if(typeof service === "function") {
                        return service.apply(null, args)
                    }
                }
            );
        },
        // TODO: if I can run stuff I should be able to instantiate also?
        // instantiate: function()
        // {
        //  this.get(key).then(function(service){ service.apply(null, args) });
        //  return this;
        // },
        build: function(config)
        {
            // TODO: I think this should push onto loading for multiple .build calls?
            this.loading = this.load.apply(this, arguments).catch(
                function(e)
                {
                    throw e;
                }
            )
            return this;
        },
        applyFilters: function(service, id, services)
        {
            const container = this;
            const type = typeof service;
            if(
                service == null ||
                type !== "object" ||
                (
                    (
                        service.constructor != Object && id != "imports" //TODO: We shouldn't know about imports
                    )
                )
            ) {
                this.container.set(
                    id,
                    function()
                    {
                        return Promise.resolve(service)
                    }
                );
                return Promise.resolve(services);
            }
            if(this.filters.length == 0) {
                return Promise.resolve(services);
            }
            const first = this.filters[0](container, service, id, services);
            return this.filters.reduce(
                function(prev, filter, i, arr)
                {
                    return prev.then(
                        function(definitions)
                        {
                            services = definitions || services;
                            const result = filter(container, services[id], id, services);
                            if(result == null) {
                                return services;
                            }
                            return result;
                        }
                    )
                },
                first instanceof Promise ? first : Promise.resolve(first)
            );
        },
        processKey: function(index, key, services)
        {
            return this.applyFilters(services[key], key, services).then(
                function(services)
                {
                    const keys = Object.keys(services);
                    const next = index + 1;
                    if(next < keys.length) {
                        return this.processKey(next, keys[next], services);
                    }
                    return services;
                }.bind(this)
            )
        },
        _load: function(services)
        {
            //callable?
            if(typeof services.__esModule !== "undefined" && services.__esModule === true
                && typeof services.default !== "undefined"
            ) {
                services = services.default;
            }
            if(typeof services === "function") {
                services = services(this);
            }
            // TODO: You should be able to use promises resolving to objects
            var process = function(services)
            {
                if(services == null || typeof services !== "object") {
                    throw new Error("Service definitions should be an object, a function returning an object (or a !!promise resolving to an object!!)")
                }
                var index = 0;
                const next = Object.keys(services)[index];
                return this.processKey(index, next, services).then(
                    function()
                    {
                        return this;
                    }.bind(this)
                )
            }
            if(services instanceof Promise) {
                return services.then(
                    process.bind(this)
                );
            }
            return process.bind(this)(services)
        },
        load: function(services)
        {
            if(typeof services == "string") {
                // const systems = this.getTagged("dom.system.import");
                // if(!systems || systems.length < 1) {
                //  throw new Error("A System.import implementation is not defined, tag a callable dom.system.import service that implements `import` to use load")
                // }
                // const System_import = systems[systems.length - 1];
                // if(typeof System_import !== "function") {
                //  throw new Error("A System.import implementation is not defined but is not callable, tag a callable dom.system.import service that implements `import` to use load")
                // }
                if(typeof this.import !== "function") {
                    throw new Error("This builder doesn't know how to load");
                    // throw new Error("A System.import implementation is not defined but is not callable, tag a callable dom.system.import service that implements `import` to use load")
                }
                return this.import(
                    services
                ).then(
                    function(services)
                    {
                        return this._load(services);
                    }.bind(this)
                );
            } else {
                return this._load(services);
            }
        },
        getContainer: function()
        {
            return this.container;
        }
    
    }
);
module.exports = Builder;
