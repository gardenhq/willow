module.exports = function()
{
    var root = "@gardenhq/willow";
    return {
        "willow.filter.service": {
            "filter": root + "/filters/service"
        },
        "willow.filter.factory": {
            "filter": root + "/filters/factory"
        },
        "willow.filter.tags": {
            "filter": root + "/filters/tags"
        }
    };
        
}
