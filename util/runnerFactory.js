module.exports = function(builder, destructure)
{
    return function(container, cb, main)
    {
        return builder.build(container).run(main || "main").then(
            function(services)
            {
                destructure(
                    services,
                    cb
                );
            }
        );
    }
}
