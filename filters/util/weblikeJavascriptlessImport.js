module.exports = function($require)
{
    return function(path)
    {
        // ends in a slash, just force index.js
        if(path[path.length - 1] === "/") {
            path = path + "index.js";
        } else {
            var temp = path.split("/");
            // length is 1 so its a simple nodejs module "something"
            var len = 1;
            if(path.indexOf("@") === 0) {
                // starts with a @ and length is 2 its an org nodejs module "@somewhere/something"
                len = 2;
            }
            if(temp.length > len) {
                var last = temp.pop();
                if(last.indexOf(".") === -1) {
                    path = path + ".js";
                }
            }
        }
        return $require.apply(null, arguments);
    }
}
