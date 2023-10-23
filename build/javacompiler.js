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
 * Defines a new property directly on an object, or modifies an existing property on an object, and returns the object.
 * This property "__esModule" is set to true to indicate that this object has been transformed by Babel.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const fs_2 = require('fs');
let logStream = fs_2.createWriteStream("./debug.log", { flags: 'a' });
/**
 * Logs a message to the console and writes it to a file.
 * 
 * @param {string} message - The message to log and write to a file.
 */
function logToFile(message) {
    console.log(message);
    logStream.write(message + "\n");
}
/**
 * Compiles and executes Java code, and returns the output and Java version.
 * 
 * @param {string} code - The Java code to compile and execute.
 * @param {string} filename - The name of the file to create for the Java code.
 * @returns {Promise} A promise that resolves with an object containing the output of the Java code and the Java version.
 */
function JavaCompiler(code, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            try {
                //create file to execute
                const fullpath = path_1.default.join(__dirname, "java", `${filename}.java`);
                const fullpathexe = path_1.default.join(__dirname, "java", `${filename}.class`);
                const javaDir = path_1.default.join(__dirname, "java");
                //create java dir if not exist
                if (!(0, fs_1.existsSync)(javaDir)) {
                    (0, fs_1.mkdirSync)(javaDir, { recursive: true });
                }
                (0, fs_1.writeFileSync)(fullpath, code, {
                    encoding: "utf8",
                    flag: "w",
                });
                // delete files if environment issue
                const catchBlock = (err) => {
                    (0, fs_1.rmSync)(javaDir, {
                        force: true,
                        recursive: true,
                    });
                    logToFile('JavaCompiler Error: ' + err)
                    rej(err);
                };
                // create classs files and compile
                (0, child_process_1.exec)(`javac ${fullpath}`, (err, stdout, stderr) => {
                    if (err)
                        catchBlock("javac failed");
                    (0, child_process_1.exec)(`java -cp ${javaDir} ${filename}`, (err, stdout, stderr) => {
                        if (err)
                            catchBlock("java failed");
                        const result = stdout;
                        (0, child_process_1.exec)("java --version", (err, stdout, stderr) => {
                            if (err)
                                catchBlock("java version failed");
                            const version = stdout.split("\n")[0].split(" ")[1];
                            (0, fs_1.rmSync)(javaDir, {
                                force: true,
                                recursive: true,
                            });
                            res({
                                result,
                                version,
                            });
                        });
                    });
                });
            }
            catch (error) {
                logToFile('JavaCompiler Error: ' + error)
                rej(typeof error === "string" ? error : "failed to execute");
            }
        });
    });
}
exports.default = JavaCompiler;