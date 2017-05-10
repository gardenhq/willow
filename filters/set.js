module.exports = function(key)
{
    key = key || "@";
    return function(container, definition, id, definitions)
    {
        if(id.indexOf(key) === 0) {
            container.set(id.substr(key.length), function(container){ return definition; });
        }
    }
}

