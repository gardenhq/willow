module.exports = function traverse(obj, callback, trail)
{
    trail = trail || []

    Object.keys(obj).forEach(
        function (key)
        {
            var value = obj[key]

            if (value != null && Object.getPrototypeOf(value) === Object.prototype) {
                traverse(value, callback, trail.concat(key))
            } else {
                obj[key] = callback.call(obj, value, key, trail)
            }
        }
    )
}

