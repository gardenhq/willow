module.exports = function(key)
{
    key = key || "service";
    return function service(container, definition, id, definitions)
    {
        if(typeof definition[key] !== "undefined") {
            container.set(id, definition[key]);
        }
    }
}

