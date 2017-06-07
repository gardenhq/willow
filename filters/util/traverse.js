module.exports = function traverse(obj, callback, trail)
{
    trail = trail || []
    Object.keys(obj).forEach(
        function(key)
        {
            var value = obj[key];
            // IE doesn't like Object.getPrototypeOf("string")
            if (value != null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
                traverse(value, callback, trail.concat(key))
            } else {
                obj[key] = callback.call(obj, value, key, trail)
            }
        }
    )
}

