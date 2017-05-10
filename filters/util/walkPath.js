module.exports = function(key, value)
{
    return key.split(".").reduce(
        function(previous, item, i, arr)
        {
            return previous[item];
        },
        value
    );
}

