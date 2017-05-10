module.exports = function()
{
    var root = "@gardenhq/willow";
    var id = "willow";
    return {
        "willow.filter.class": {
            "filter": root + "/filters/class",
            "arguments": [
                "@" + id + ".loadAndEval",
                "@" + id + ".resolve.arguments",
                "@" + id+ ".resolveIdentifier",
                "@" + id + ".traverse"
            ],
            "tags": [
                id + ".filter"
            ]
        },
        "willow.filter.object": {
            "filter": root + "/filters/object",
            "arguments": [
                "@" + id + ".loadAndEval"
            ],
            "tags": [
                id + ".filter"
            ]
        },
        "willow.filter.share": {
            "filter": root + "/filters/shared"
        },
        "willow.filter.resolve": {
            "filter": root + "/filters/resolve",
            "arguments": [
                "@" + id + ".resolve.resolve"
            ],
            "tags": [
                id + ".filter"
            ]
        },
        "willow.filter.iterator": {
            "filter": root + "/filters/iterator",
            "arguments": [
                "@" + id + ".resolve.arguments"
            ],
            "tags": [
                id + ".filter"
            ]
        }
    };
        
}
