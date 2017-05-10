module.exports = function(key)
{
    key = key || "shared";
    return function shared(container, definition, id, definitions)
    {
        if(definition[key] === false) {
            // definition['factory'] = definition['service'];
            container.factory(id, definition['service']);
            definition['service'] = null;
        }
    }
};

