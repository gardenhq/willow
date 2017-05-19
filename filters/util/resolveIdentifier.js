/**
 * Shell variable substitution code taken from 'somewhere'?
 *
 * Not sure who :(
 * This will be cleaned up at some point anyway
 *
 */

function substiteVariable(variable, options, cb) {
        var value;
        var err = null;
        var s = variable.split(':', 2);
        if (s.length == 2) {
            value = options.env[s[0]];
            if (typeof value == 'function') {
                value = value();
            }
            if (s[1][0] == '+') { // Substitute replacement, but only if variable is defined and nonempty. Otherwise, substitute nothing
                value = value ? s[1].substring(1) : '';
            } else if (s[1][0] == '-') { // Substitute the value of variable, but if that is empty or undefined, use default instead
                value = value || s[1].substring(1);
            } else if (s[1][0] == '#') { // Substitute with the length of the value of the variable
                value = value !== undefined ? String(value).length : 0;
            } else if (s[1][0] == '=') { // Substitute the value of variable, but if that is empty or undefined, use default instead and set the variable to default
                if (!value) {
                    value = s[1].substring(1);
                    options.env[s[0]] = value;
                }
            } else if (s[1][0] == '?') { // If variable is defined and not empty, substitute its value. Otherwise, print message as an error message.
                if (!value) {
                    if (s[1].length > 1) {
                        throw new Error();
                        // return cb(s[0] + ': ' + s[1].substring(1));
                    } else {
                        throw new Error();
                        // return cb(s[0] + ': parameter null or not set');
                    }
                }
            }
        } else {
            value = options.env[variable];
            if (typeof value == 'function') {
                value = value();
            }
        }
    return value;
    }
function substiteVariablesInternal(str, position, result, options, cb) {
        if (position == -1 || !str) {
            return result;

        } else {
            var index = str.indexOf('$', position);

            if (index == -1) { // no $
                result += str.substring(position);
                position = -1;
                return result;

            } else { // $ found
                var variable;
                var endIndex;
                result += str.substring(position, index);

                if (str.charAt(index+1) == '{') { // ${VAR}
                    endIndex = str.indexOf('}', index);
                    if (endIndex == -1) { // '}' not found
                        if (options.ignoreErrors) {
                            variable = str.substring(index+2);
                        } else {
                            throw new Error();
                        }
                    } else { // '}' found
                        variable = str.substring(index+2, endIndex);
                        endIndex++;
                    }
                    if (!variable) {
                        result += '${}';
                    }
                } else { // $VAR
                    index++; // skip $
                    endIndex = -1;
                    // special single char vars
                    if (options.specialVars && options.specialVars.indexOf(str[index]) != -1) {
                        variable = str[index];
                        endIndex = index + 1;
                    } else {
                        // search for var end
                        for (var i = index, len = str.length; i < len; i++) {
                            var code = str.charCodeAt(i);
                            if (!(code > 47 && code < 58) &&  // numeric
                                !(code > 64 && code < 91) &&  // upper alpha
                                (code !== 95) &&              // underscore
                                !(code > 96 && code < 123)) { // lower alpha
                                endIndex = i;
                                break;
                            }
                        }

                        if (endIndex == -1) { // delimeter not found
                            variable = str.substring(index);
                        } else { // delimeted found
                            variable = str.substring(index, endIndex);
                        }
                    }
                    if (!variable) {
                        result += '$';
                    }
                }
                position = endIndex;
                if (! variable) {
                    return substiteVariablesInternal(str, position, result, options, cb);
                } else {
                    return substiteVariable(variable, options,  function callback(err, value) {
                        if (err && !options.ignoreErrors) {
                            return cb(err);
                        }
                        if (value !== null && value !== undefined) {
                            result += String(value);
                        }
                        substiteVariablesInternal(str, position, result, options, cb);
                    });
                }
            }
        }
    }
module.exports = function(walkPath, servicePrefix, tagPrefix, splitIdentifier)
{
    var varPrefix = "$";
    var argPrefix = "--";
    return function(item, container)
    {
        if(typeof item !== "string") {
            return item;
        }
        if(item.indexOf(servicePrefix) === 0) {
            var service = container.get(item.substr(servicePrefix.length));
            var identifier = splitIdentifier(item);
            if(identifier.path) {
                return walkPath(identifier.path, service);
            }
            return service;
        } else if(item.indexOf(tagPrefix) === 0) {
            var tagged = container.getTagged(item.substr(tagPrefix.length));
            if(tagged.length === 0) {
                return Promise.resolve([]);
            }
            var promises = [];
            var keys = Object.keys(
                tagged
            );
            keys.forEach(
                function(item, i, arr)
                {
                    promises.push(tagged[item]);
                }
            );
            return Promise.all(
                promises
            ).then(
                function(services)
                {
                    var obj = {};
                    // TODO: do this better, maybe after with Array.toArray()
                    if(keys[0] == 0) {
                        obj = [];
                    }
                    services.forEach(
                        function(item, i, arr)
                        {
                            obj[keys[i]] = item;
                        }
                    );
                    return obj;
                }
            );
        } else if(item.indexOf(varPrefix) === 0) {
            return substiteVariablesInternal(item, "", 0, process);
        } else if (item.indexOf(argPrefix) === 0) {
            var value;
            // TODO: This should only be done once not everytime I encounter a --
            // TODO: equivalent of args for the web are request vars, or hash, probably hash ?
            process.argv.forEach(
                function(arg, i, arr)
                {
                    var temp = arg.split("=");
                    if(temp[0] === item) {
                        var next = arr[i + 1] || "-";
                        if(temp.length === 1 && next.indexOf("-") !== 0) {
                            value = next;
                        } else {
                            value = temp[1] || true;
                        }
                    }
                }
            );
            return value;
        } else {
            return item;
        }
    }
};
