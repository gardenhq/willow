const chai = require("chai");
const td = require("testdouble");
const tdChai = require("testdouble-chai");
chai.use(tdChai(td));
chai.use(
    function(chai, utils)
    {
        utils.addMethod(
            chai.Assertion.prototype,
            "calledTimes",
            function(times)
            {
                td.verify(this._obj.apply(
                    this._obj,
                    [
                    ]
                ), {ignoreExtraArgs: true, times: times});
            }
        );
    }
);

const expect = chai.expect;
module.exports = {
    expect: expect,
    td: td
};
