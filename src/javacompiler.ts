import { exec } from "child_process";
import { existsSync, lstatSync, mkdirSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { stderr } from "process";

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
      console.log({ error });
      rej(typeof error === "string" ? error : "failed to execute");
    }
  });
}
