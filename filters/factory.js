module.exports = function(key)
{
    key = key || "factory";
    return function factory(container, definition, id, definitions)
    {
        if(typeof definition[key] !== "undefined") {
            container.factory(id, definition[key]);
        }
    }
}


