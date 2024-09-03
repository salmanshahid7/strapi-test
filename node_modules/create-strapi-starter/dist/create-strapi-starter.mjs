import { readFileSync } from "node:fs";
import { resolve as resolve$1 } from "node:path";
import commander, { CommanderError } from "commander";
import path, { resolve, basename, join } from "path";
import os from "os";
import fse from "fs-extra";
import ora from "ora";
import ciEnv from "ci-info";
import chalk from "chalk";
import { generateNewApp } from "@strapi/generate-new";
import execa from "execa";
import { execSync } from "child_process";
import inquirer from "inquirer";
function hasYarn() {
  try {
    const { exitCode } = execa.commandSync("yarn --version", { shell: true });
    if (exitCode === 0)
      return true;
  } catch (err) {
    return false;
  }
}
const logger = {
  error(message) {
    console.error(`${chalk.red("error")}: ${message}`);
  },
  warn(message) {
    console.log(`${chalk.yellow("warning")}: ${message}`);
  },
  info(message) {
    console.log(`${chalk.blue("info")}: ${message}`);
  }
};
function runInstall(path2, { useYarn } = {}) {
  return execa(useYarn ? "yarn" : "npm", ["install"], {
    cwd: path2,
    stdin: "ignore"
  });
}
function runApp(rootPath, { useYarn } = {}) {
  if (useYarn) {
    return execa("yarn", ["develop"], {
      stdio: "inherit",
      cwd: rootPath
    });
  }
  return execa("npm", ["run", "develop"], {
    stdio: "inherit",
    cwd: rootPath
  });
}
async function initGit(rootPath) {
  try {
    await execa("git", ["init"], {
      cwd: rootPath
    });
  } catch (err) {
    logger.warn("Could not initialize a git repository");
  }
  try {
    await execa("git", ["add", "-A"], { cwd: rootPath });
    execSync('git commit -m "Create Strapi starter project"', {
      cwd: rootPath
    });
  } catch (err) {
    logger.warn("Could not create initial git commit");
  }
}
function stopProcess(message) {
  if (message) {
    logger.error(message);
  }
  return process.exit(1);
}
async function getPackageInfo(packageName, options) {
  const { useYarn } = options ?? {};
  if (useYarn) {
    const { stdout: stdout2 } = await execa("yarn", ["info", packageName, "--json"]);
    const yarnInfo = JSON.parse(stdout2);
    return {
      name: yarnInfo.data.name,
      version: yarnInfo.data.version
    };
  }
  const { stdout } = await execa("npm", ["view", packageName, "name", "version", "--silent"]);
  const match = stdout.match(/(?<=')(.*?)(?=')/gm);
  if (!match) {
    throw new Error("No match for name@version");
  }
  const [name, version] = match;
  return { name, version };
}
async function getStarterPackageInfo(starter, options) {
  const { useYarn } = options ?? {};
  try {
    const longhand = `@strapi/starter-${starter}`;
    return await getPackageInfo(longhand, { useYarn });
  } catch (error) {
  }
  try {
    return await getPackageInfo(starter, { useYarn });
  } catch (error) {
    return stopProcess(`Could not find package ${chalk.yellow(starter)} on npm`);
  }
}
async function downloadNpmStarter(packageInfo, parentDir, options) {
  const { name, version } = packageInfo;
  const { useYarn } = options ?? {};
  if (useYarn) {
    await execa("yarn", ["add", `${name}@${version}`, "--no-lockfile", "--silent"], {
      cwd: parentDir
    });
  } else {
    await execa("npm", ["install", `${name}@${version}`, "--no-save", "--silent"], {
      cwd: parentDir
    });
  }
  const exactStarterPath = path.dirname(
    require.resolve(`${name}/package.json`, { paths: [parentDir] })
  );
  return exactStarterPath;
}
function readStarterJson(filePath, starter) {
  try {
    const data = fse.readFileSync(filePath);
    return JSON.parse(data.toString());
  } catch (err) {
    stopProcess(`Could not find ${chalk.yellow("starter.json")} in ${chalk.yellow(starter)}`);
  }
}
async function initPackageJson(rootPath, projectName, { useYarn } = {}) {
  const packageManager = useYarn ? "yarn --cwd" : "npm run --prefix";
  try {
    await fse.writeJson(
      join(rootPath, "package.json"),
      {
        name: projectName,
        private: true,
        version: "0.0.0",
        scripts: {
          "develop:backend": `${packageManager} backend develop`,
          "develop:frontend": `wait-on http://localhost:1337/admin && ${packageManager} frontend develop`,
          develop: "cross-env FORCE_COLOR=1 npm-run-all -l -p develop:*"
        },
        devDependencies: {
          "npm-run-all": "4.1.5",
          "wait-on": "5.2.1",
          "cross-env": "7.0.3"
        }
      },
      {
        spaces: 2
      }
    );
  } catch (err) {
    stopProcess(`Failed to create ${chalk.yellow("package.json")} in ${chalk.yellow(rootPath)}`);
  }
}
async function installWithLogs(path2, options) {
  const installPrefix = chalk.yellow("Installing dependencies:");
  const loader = ora(installPrefix).start();
  const logInstall = (chunk = "") => {
    loader.text = `${installPrefix} ${chunk.toString().split("\n").join(" ")}`;
  };
  const runner = runInstall(path2, options);
  runner.stdout?.on("data", logInstall);
  runner.stderr?.on("data", logInstall);
  await runner;
  loader.stop();
  console.log(`Dependencies installed ${chalk.green("successfully")}.`);
}
async function getStarterInfo(starter, { useYarn } = {}) {
  const isLocalStarter = ["./", "../", "/"].some((filePrefix) => starter.startsWith(filePrefix));
  let starterPath;
  let starterParentPath;
  let starterPackageInfo;
  if (isLocalStarter) {
    console.log("Installing local starter.");
    starterPath = resolve(starter);
  } else {
    starterPackageInfo = await getStarterPackageInfo(starter, { useYarn });
    console.log(`Installing ${chalk.yellow(starterPackageInfo.name)} starter.`);
    starterParentPath = await fse.mkdtemp(join(os.tmpdir(), "strapi-"));
    starterPath = await downloadNpmStarter(starterPackageInfo, starterParentPath, { useYarn });
  }
  return { isLocalStarter, starterPath, starterParentPath, starterPackageInfo };
}
async function buildStarter({ projectName, starter }, program2) {
  const hasYarnInstalled = hasYarn();
  const { isLocalStarter, starterPath, starterParentPath, starterPackageInfo } = await getStarterInfo(starter, { useYarn: hasYarnInstalled });
  const rootPath = resolve(projectName);
  const projectBasename = basename(rootPath);
  const starterJson = readStarterJson(join(starterPath, "starter.json"), starter);
  try {
    await fse.ensureDir(rootPath);
  } catch (error) {
    if (error instanceof Error) {
      stopProcess(`Failed to create ${chalk.yellow(rootPath)}: ${error.message}`);
    }
    stopProcess(`Failed to create ${chalk.yellow(rootPath)}: ${error}`);
  }
  const frontendPath = join(rootPath, "frontend");
  try {
    await fse.copy(join(starterPath, "starter"), frontendPath, {
      overwrite: true,
      recursive: true
    });
  } catch (error) {
    if (error instanceof Error) {
      stopProcess(`Failed to create ${chalk.yellow(frontendPath)}: ${error.message}`);
    }
    stopProcess(`Failed to create ${chalk.yellow(frontendPath)}`);
  }
  if (!isLocalStarter && starterParentPath) {
    await fse.remove(starterParentPath);
  }
  const generateStrapiAppOptions = {
    ...program2,
    starter: starterPackageInfo?.name,
    run: false
  };
  if (starterJson.template.version) {
    generateStrapiAppOptions.template = `${starterJson.template.name}@${starterJson.template.version}`;
  } else {
    generateStrapiAppOptions.template = starterJson.template.name;
  }
  await generateNewApp(join(rootPath, "backend"), generateStrapiAppOptions);
  console.log(`Creating Strapi starter frontend at ${chalk.yellow(frontendPath)}.`);
  console.log("Installing frontend dependencies");
  await installWithLogs(frontendPath, { useYarn: hasYarnInstalled });
  initPackageJson(rootPath, projectBasename, { useYarn: hasYarnInstalled });
  try {
    const gitignore = join(__dirname, "..", "resources", "gitignore");
    await fse.copy(gitignore, join(rootPath, ".gitignore"));
  } catch (err) {
    logger.warn(`Failed to create file: ${chalk.yellow(".gitignore")}`);
  }
  await installWithLogs(rootPath, { useYarn: hasYarnInstalled });
  if (!ciEnv.isCI) {
    await initGit(rootPath);
  }
  console.log(chalk.green("Starting the app"));
  await runApp(rootPath, { useYarn: hasYarnInstalled });
}
async function promptUser(projectName, starter, program2) {
  const questions = [
    {
      type: "input",
      default: "my-strapi-project",
      name: "directory",
      message: "What would you like to name your project?",
      when: !projectName
    },
    {
      type: "list",
      name: "quick",
      message: "Choose your installation type",
      when: !program2.quickstart,
      choices: [
        {
          name: "Quickstart (recommended)",
          value: true
        },
        {
          name: "Custom (manual settings)",
          value: false
        }
      ]
    },
    {
      type: "input",
      name: "starter",
      when: !starter,
      message: "Please provide the npm package name of the starter you want to use:"
    }
  ];
  return inquirer.prompt(questions);
}
const packageJson = JSON.parse(readFileSync(resolve$1(__dirname, "../package.json"), "utf8"));
const program = new commander.Command(packageJson.name);
const incompatibleQuickstartOptions = [
  "dbclient",
  "dbhost",
  "dbport",
  "dbname",
  "dbusername",
  "dbpassword",
  "dbssl",
  "dbfile"
];
program.version(packageJson.version).arguments("[directory], [starter]").option("--use-npm", "Force usage of npm instead of yarn to create the project").option("--debug", "Display database connection error").option("--quickstart", "Quickstart app creation").option("--dbclient <dbclient>", "Database client").option("--dbhost <dbhost>", "Database host").option("--dbport <dbport>", "Database port").option("--dbname <dbname>", "Database name").option("--dbusername <dbusername>", "Database username").option("--dbpassword <dbpassword>", "Database password").option("--dbssl <dbssl>", "Database SSL").option("--dbfile <dbfile>", "Database file path for sqlite").option("--dbforce", "Overwrite database content if any").description(
  "Create a fullstack monorepo application using the strapi backend template specified in the provided starter"
).action((directory, starter, programArgs) => {
  const projectArgs = { projectName: directory, starter };
  initProject(projectArgs, programArgs);
});
function generateApp(projectArgs, programArgs) {
  if (!projectArgs.projectName || !projectArgs.starter) {
    console.error(
      "Please specify the <directory> and <starter> of your project when using --quickstart"
    );
    process.exit(1);
  }
  return buildStarter(projectArgs, programArgs);
}
async function initProject(projectArgs, programArgs) {
  const hasIncompatibleQuickstartOptions = incompatibleQuickstartOptions.some(
    (opt) => programArgs[opt]
  );
  if (programArgs.quickstart && hasIncompatibleQuickstartOptions) {
    console.error(
      `The quickstart option is incompatible with the following options: ${incompatibleQuickstartOptions.join(
        ", "
      )}`
    );
    process.exit(1);
  }
  if (hasIncompatibleQuickstartOptions) {
    programArgs.quickstart = false;
  }
  const { projectName, starter } = projectArgs;
  if (programArgs.quickstart) {
    return generateApp(projectArgs, programArgs);
  }
  const prompt = await promptUser(projectName, starter, programArgs);
  const promptProjectArgs = {
    projectName: prompt.directory || projectName,
    starter: prompt.starter || starter
  };
  return generateApp(promptProjectArgs, {
    ...programArgs,
    quickstart: prompt.quick || programArgs.quickstart
  });
}
try {
  program.parse(process.argv);
} catch (err) {
  if (err instanceof CommanderError) {
    if (err.exitCode && err.exitCode !== 0) {
      program.outputHelp();
    }
  }
}
//# sourceMappingURL=create-strapi-starter.mjs.map
