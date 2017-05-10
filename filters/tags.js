module.exports = function(key)
{
    key = key || "tags";
    return function tags(builder, definition, id, definitions)
    {
        (definition[key] || []).forEach(
            function(item, i, arr)
            {
                var tag = item;
                var meta = {};
                if(typeof tag !== "string") {
                    tag = item.name;
                    meta = item;
                }
                builder.tag(id, tag, meta);
            }
        );
    }
};
