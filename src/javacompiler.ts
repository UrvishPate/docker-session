import { exec } from "child_process";
import { existsSync, lstatSync, mkdirSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { stderr } from "process";
import fs from 'fs';
let logStream = fs.createWriteStream("./debug.log", { flags: 'a' });
/**
 * Logs a message to the console and writes it to a log file.
 *
 * @param message - The message to log.
 */
function logToFile(message: string) {
    console.log(message);
    logStream.write(message + "\n");
}
/**
 * Compiles and executes Java code asynchronously.
 *
 * @param {string} code - The Java code to compile and execute.
 * @param {string} filename - The name of the file to create for the Java code.
 * @returns {Promise<{result: string, version: string}>} - A promise that resolves with the result of the code execution and the version of Java used, or rejects with an error message.
 */
export default async function JavaCompiler(
  code: string,
  filename: string
): Promise<{
  result: string;
  version: string;
}> {
  return new Promise((res, rej) => {
    try {
      //create file to execute
      const fullpath = path.join(__dirname, "java", `${filename}.java`);
      const fullpathexe = path.join(__dirname, "java", `${filename}.class`);
      const javaDir = path.join(__dirname, "java");

      //create java dir if not exist
      if (!existsSync(javaDir)) {
        mkdirSync(javaDir, { recursive: true });
      }
      writeFileSync(fullpath, code, {
        encoding: "utf8",
        flag: "w",
      });

      // delete files if environment issue
      const catchBlock = (err: string) => {
        rmSync(javaDir, {
          force: true,
          recursive: true,
        });
        logToFile('Java Compiler Error: ' + err);
        rej(err);
      };

      // create classs files and compile
      exec(`javac ${fullpath}`, (err, stdout, stderr) => {
        if (err) catchBlock("javac failed");
        exec(`java -cp ${javaDir} ${filename}`, (err, stdout, stderr) => {
          if (err) catchBlock("java failed");
          const result = stdout;
          exec("java --version", (err, stdout, stderr) => {
            if (err) catchBlock("java version failed");
            const version = stdout.split("\n")[0].split(" ")[1];
            rmSync(javaDir, {
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
    } catch (error) {
      logToFile('Java Compiler Error: ' + error);
      rej(typeof error === "string" ? error : "failed to execute");
    }
  });
}