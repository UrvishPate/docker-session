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
/**
 * This line of code sets the ES Module (ESM) interoperability flag to true for the current module.
 * This allows the module to be imported using the `import` statement in other modules.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const javacompiler_1 = __importDefault(require("./javacompiler"));
const fs = require('fs');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT;
const customENV = process.env.CUSTOMENV;
let logStream = fs.createWriteStream("./debug.log", { flags: 'a' });
/**
 * Logs a given message to the console and to a file.
 * 
 * @param {string} message - The message to log.
 */
function logToFile(message) {
    console.log(message);
    logStream.write(message + "\n");
}
/**
 * Endpoint for compiling Java code.
 * It takes a POST request with the code and filename in the body.
 * It logs the input and output to a file and returns the compiled code and version.
 * If an error occurs during compilation, it logs the error and returns it in the response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise} - A promise that resolves to a JSON object containing the result of the compilation and the version of Java used.
 */
app.post("/java-compiler", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, filename } = req.body;
        if (!code || !filename)
            throw "Required Body";
        logToFile("Java Input:");
        logToFile("---------------------");
        logToFile(code);
        const compiled_code = yield (0, javacompiler_1.default)(code, filename);
        logToFile("Java Output:");
        logToFile("---------------------");
        logToFile(compiled_code.result);
        res.status(200).json({
            result: compiled_code.result,
            version: compiled_code.version,
        });
    }
    catch (error) {
        logToFile('Java Compiler Error: ' + error)
        res.status(200).json({
            error,
        });
    }
}));
/**
 * Handles GET requests to the "/test" endpoint.
 * Logs the server status and returns a JSON response with the server status and a custom environment variable.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get("/test", (req, res) => {
    logToFile(`server running on ${port}`);
    res.status(200).json({
        message: `server running on ${port}`,
        customenv: `custom environment variable ${customENV || "invalid"}`,
    });
});
/**
 * Starts the server and listens on the specified port. Logs a message to a file when the server starts.
 * 
 * @param {number} port - The port number on which the server should listen.
 * @param {function} callback - A callback function to execute when the server starts. In this case, it logs a message to a file.
 */
app.listen(port, () => {
    logToFile(`server started on ${port}`);
});