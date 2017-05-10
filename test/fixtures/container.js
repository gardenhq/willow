module.exports = function()
{
    return {
        "imports":[
            "./test/fixtures/container.import.js"
        ],
        "simple.class": {
            "class": "./test/fixtures/TestClass.js",
            "arguments": [
                "a",
                "b",
                "c"
            ]
        },
        "tagged.number": {
            "service": function()
            {
                return 1;
            }
        }

    };
}

