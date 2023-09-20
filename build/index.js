"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const javacompiler_1 = __importDefault(require("./javacompiler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT;
const customENV = process.env.CUSTOMENV;
// java compiler
app.post("/java-compiler", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, filename } = req.body;
        if (!code || !filename)
            throw "Required Body";
        console.time("compiled");
        console.log("Java Input:");
        console.log("---------------------");
        console.log(code);
        const compiled_code = yield (0, javacompiler_1.default)(code, filename);
        console.log("Java Output:");
        console.log("---------------------");
        console.log(compiled_code.result);
        console.timeEnd("compiled");
        res.status(200).json({
            result: compiled_code.result,
            version: compiled_code.version,
        });
    }
    catch (error) {
        res.status(200).json({
            error,
        });
    }
}));
// simple end point
app.get("/test", (req, res) => {
    res.status(200).json({
        message: `server running on ${port}`,
        customenv: `custom environment variable ${customENV || "invalid"}`,
    });
});
app.listen(port, () => {
    console.log(`server started on ${port}`);
});
