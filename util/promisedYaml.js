module.exports = function(createPromised, toYaml, read)
{
    const yamlExtension = ".yaml";
    const ymlExtension = ".yml";
    // TODO: this is no longer yaml specific need to split out
    const htmlExtension = ".html";
    const isYaml = function(path)
    {
        return (path.indexOf(yamlExtension) === Math.max(0, path.length - yamlExtension.length))
        || (path.indexOf(ymlExtension) === Math.max(0, path.length - ymlExtension.length))
    }
    const isHtml = function(path)
    {
        return (path.indexOf(htmlExtension) === Math.max(0, path.length - htmlExtension.length));
    }
    read = read || require("fs").readFile;
    return function(require)
    {
        const promisedRequire = createPromised(require);
        return function(path)
        {
            const yaml = isYaml(path);
            const html = isHtml(path);
            if(
                yaml || html
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
                                resolve(yaml ? toYaml(path, str) : str.toString());
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

