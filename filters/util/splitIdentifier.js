module.exports = function(separator)
{
    separator = separator || ":";
    return function(identifier)
    {
        var pos = identifier.lastIndexOf(separator);
        var protocol = identifier.indexOf("://");
        if(pos !== -1) {
            var temp = identifier.split(separator);
            if(protocol !== -1) {
                return {
                    file: temp[0] + ":" + temp[1],
                    path: temp[2]
                };
            }
            return {
                file: temp[0],
                path: temp[1]
            };
        } else  {
            return {
                file: identifier,
                path: null
            }
        }
    }
}
