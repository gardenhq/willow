var values = function(obj)
{
    return Object.keys(obj).reduce(
        function(prev, item)
        {
            return prev.concat(obj[item]);
        },
        []
    );
}
if(typeof Object.values === "undefined") {
    Object.values = values;
}
module.exports = function(obj, cb)
{
    if(!Array.isArray(obj)) {
        if(typeof obj !== "object") {
            obj = [obj];
        } else {
            obj = Object.values(obj);
        }
    }
    return cb.apply(null, obj);
}
