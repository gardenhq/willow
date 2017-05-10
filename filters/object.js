module.exports = function(loader)
{
    return loader(
        "object",
        function(resolve, reject, module, object, container, definition)
        {
            resolve(module);
        }
    );
        
}
