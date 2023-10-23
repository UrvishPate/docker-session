import Express from "express";
import cors from "cors";
import "dotenv/config";
import JavaCompiler from "./javacompiler";
import fs from 'fs';
const app = Express();
app.use(cors());
app.use(Express.json());
const port = process.env.PORT;
const customENV = process.env.CUSTOMENV;
let logStream = fs.createWriteStream("./debug.log", { flags: 'a' });
/**
 * Logs a message to the console and writes it to a log file.
 * 
 * @param {string} message - The message to log.
 */
function logToFile(message) {
    console.log(message);
    logStream.write(message + "\n");
}
/**
 * Endpoint for compiling Java code.
 * 
 * This endpoint accepts POST requests with a body containing the code to be compiled and the filename.
 * It compiles the code and returns the result along with the version of the compiler used.
 * 
 * @param req The request object, containing the code and filename in the body.
 * @param res The response object, used to send the result of the compilation back to the client.
 */
app.post("/java-compiler", async (req, res) => {
  try {
    const { code, filename } = req.body;
    if (!code || !filename) throw new Error("Required Body");
    console.time("compiled")
    logToFile("Java Input:")
    logToFile("---------------------")
    logToFile(code)
    const compiled_code = await JavaCompiler(code, filename);
    logToFile("Java Output:")
    logToFile("---------------------")
    logToFile(compiled_code.result)
    console.timeEnd("compiled")
    res.status(200).json({
      result: compiled_code.result,
      version: compiled_code.version,
    });
  } catch (error) {
    logToFile('Java Compiler Error: ' + error)
    res.status(200).json({
      error,
    });
  }
});
/**
 * Defines a simple GET endpoint at "/test".
 * 
 * When accessed, it responds with a JSON object containing a message indicating the server's running port and a custom environment variable.
 * If an error occurs during the process, it logs the error to a file and responds with a 500 status code and a JSON object containing the error.
 */
app.get("/test", (req, res) => {
  try {
    res.status(200).json({
      message: `server running on ${port}`,
      customenv: `custom environment variable ${customENV || "invalid"}`,
    });
  } catch (error) {
    logToFile('Test Endpoint Error: ' + error)
    res.status(500).json({
      error,
    });
  }
});
/**
 * Starts the server and listens on the specified port.
 * Logs a message to file when the server starts successfully, or an error message if the server fails to start.
 */
app.listen(port, () => {
  try {
    /**
     * Logs a message to file indicating that the server has started successfully.
     */
    logToFile(`server started on ${port}`);
  } catch (error) {
    /**
     * Logs an error message to file if the server fails to start.
     */
    logToFile('Server Start Error: ' + error)
  }
});