module.exports = function(servicePrefix)
{
    servicePrefix = servicePrefix || "@";
    return function(identifier)
    {
        // npm has introduced '@orgs' with an at sign
        // Assume orgs will always have at least 1 folder in them as an @org on its own
        // wouldn't make sense
        var isIdentifier = identifier.file.indexOf("/") == -1 && identifier.file.indexOf(servicePrefix) === 0;
        if(isIdentifier) {
            return identifier.file.substr(1);
        }
        return false;
    }
}
