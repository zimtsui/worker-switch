"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Res = exports.Id = void 0;
const uuid_1 = require("uuid");
var Id;
(function (Id) {
    function create() {
        return (0, uuid_1.v1)();
    }
    Id.create = create;
})(Id = exports.Id || (exports.Id = {}));
var Res;
(function (Res) {
    let Fail;
    (function (Fail) {
        let Error;
        (function (Error) {
            function from(err) {
                return {
                    code: 0,
                    message: err.message,
                    data: {
                        name: err.name,
                        stack: err.stack,
                    },
                };
            }
            Error.from = from;
        })(Error = Fail.Error || (Fail.Error = {}));
    })(Fail = Res.Fail || (Res.Fail = {}));
})(Res = exports.Res || (exports.Res = {}));
//# sourceMappingURL=json-rpc.js.map