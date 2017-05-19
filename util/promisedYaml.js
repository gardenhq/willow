module.exports = function(createPromised, yaml, read)
{
    const yamlExtension = ".yaml";
    const ymlExtension = ".yml";
    read = read || require("fs").readFile;
    return function(require)
    {
        const promisedRequire = createPromised(require);
        return function(path)
        {
            if(
                (path.indexOf(yamlExtension) === Math.max(0, path.length - yamlExtension.length))
                || (path.indexOf(ymlExtension) === Math.max(0, path.length - ymlExtension.length))
            ) {
                return new Promise(
                    function(resolve, reject)
                    {
                        read(
                            path,
                            function(err, str)
                            {
                                if(err) {
                                    reject(err);
                                }
                                resolve(yaml(path, str));
                            }
                        )

                    }
                )
            } else {
                return promisedRequire(path);
            }
        }

    }
}

