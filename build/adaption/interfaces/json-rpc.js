import { v1 as makeUuid } from "uuid";
export var Id;
(function (Id) {
    function create() {
        return makeUuid();
    }
    Id.create = create;
})(Id = Id || (Id = {}));
export var Res;
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
})(Res = Res || (Res = {}));
//# sourceMappingURL=json-rpc.js.map