import Express from "express";
import cors from "cors";
import "dotenv/config";
import JavaCompiler from "./javacompiler";

const app = Express();

app.use(cors());
app.use(Express.json());

const port = process.env.PORT;
const customENV = process.env.CUSTOMENV;

// java compiler
app.post("/java-compiler", async (req, res) => {
  try {
    const { code, filename } = req.body;
    if (!code || !filename) throw "Required Body";
    console.time("compiled")
    console.log("Java Input:")
    console.log("---------------------")
    console.log(code)
    const compiled_code = await JavaCompiler(code, filename);
    console.log("Java Output:")
    console.log("---------------------")
    console.log(compiled_code.result)
    console.timeEnd("compiled")
    res.status(200).json({
      result: compiled_code.result,
      version: compiled_code.version,
    });
  } catch (error) {
    res.status(200).json({
      error,
    });
  }
});

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
