"use strict";
const node_fs = require("node:fs");
const node_path = require("node:path");
const commander = require("commander");
const path = require("path");
const os = require("os");
const fse = require("fs-extra");
const ora = require("ora");
const ciEnv = require("ci-info");
const chalk = require("chalk");
const generateNew = require("@strapi/generate-new");
const execa = require("execa");
const child_process = require("child_process");
const inquirer = require("inquirer");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const commander__default = /* @__PURE__ */ _interopDefault(commander);
const path__default = /* @__PURE__ */ _interopDefault(path);
const os__default = /* @__PURE__ */ _interopDefault(os);
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const ora__default = /* @__PURE__ */ _interopDefault(ora);
const ciEnv__default = /* @__PURE__ */ _interopDefault(ciEnv);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const execa__default = /* @__PURE__ */ _interopDefault(execa);
const inquirer__default = /* @__PURE__ */ _interopDefault(inquirer);
function hasYarn() {
  try {
    const { exitCode } = execa__default.default.commandSync("yarn --version", { shell: true });
    if (exitCode === 0)
      return true;
  } catch (err) {
    return false;
  }
}
const logger = {
  error(message) {
    console.error(`${chalk__default.default.red("error")}: ${message}`);
  },
  warn(message) {
    console.log(`${chalk__default.default.yellow("warning")}: ${message}`);
  },
  info(message) {
    console.log(`${chalk__default.default.blue("info")}: ${message}`);
  }
};
function runInstall(path2, { useYarn } = {}) {
  return execa__default.default(useYarn ? "yarn" : "npm", ["install"], {
    cwd: path2,
    stdin: "ignore"
  });
}
function runApp(rootPath, { useYarn } = {}) {
  if (useYarn) {
    return execa__default.default("yarn", ["develop"], {
      stdio: "inherit",
      cwd: rootPath
    });
  }
  return execa__default.default("npm", ["run", "develop"], {
    stdio: "inherit",
    cwd: rootPath
  });
}
async function initGit(rootPath) {
  try {
    await execa__default.default("git", ["init"], {
      cwd: rootPath
    });
  } catch (err) {
    logger.warn("Could not initialize a git repository");
  }
  try {
    await execa__default.default("git", ["add", "-A"], { cwd: rootPath });
    child_process.execSync('git commit -m "Create Strapi starter project"', {
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
    const { stdout: stdout2 } = await execa__default.default("yarn", ["info", packageName, "--json"]);
    const yarnInfo = JSON.parse(stdout2);
    return {
      name: yarnInfo.data.name,
      version: yarnInfo.data.version
    };
  }
  const { stdout } = await execa__default.default("npm", ["view", packageName, "name", "version", "--silent"]);
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
    return stopProcess(`Could not find package ${chalk__default.default.yellow(starter)} on npm`);
  }
}
async function downloadNpmStarter(packageInfo, parentDir, options) {
  const { name, version } = packageInfo;
  const { useYarn } = options ?? {};
  if (useYarn) {
    await execa__default.default("yarn", ["add", `${name}@${version}`, "--no-lockfile", "--silent"], {
      cwd: parentDir
    });
  } else {
    await execa__default.default("npm", ["install", `${name}@${version}`, "--no-save", "--silent"], {
      cwd: parentDir
    });
  }
  const exactStarterPath = path__default.default.dirname(
    require.resolve(`${name}/package.json`, { paths: [parentDir] })
  );
  return exactStarterPath;
}
function readStarterJson(filePath, starter) {
  try {
    const data = fse__default.default.readFileSync(filePath);
    return JSON.parse(data.toString());
  } catch (err) {
    stopProcess(`Could not find ${chalk__default.default.yellow("starter.json")} in ${chalk__default.default.yellow(starter)}`);
  }
}
async function initPackageJson(rootPath, projectName, { useYarn } = {}) {
  const packageManager = useYarn ? "yarn --cwd" : "npm run --prefix";
  try {
    await fse__default.default.writeJson(
      path.join(rootPath, "package.json"),
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
    stopProcess(`Failed to create ${chalk__default.default.yellow("package.json")} in ${chalk__default.default.yellow(rootPath)}`);
  }
}
async function installWithLogs(path2, options) {
  const installPrefix = chalk__default.default.yellow("Installing dependencies:");
  const loader = ora__default.default(installPrefix).start();
  const logInstall = (chunk = "") => {
    loader.text = `${installPrefix} ${chunk.toString().split("\n").join(" ")}`;
  };
  const runner = runInstall(path2, options);
  runner.stdout?.on("data", logInstall);
  runner.stderr?.on("data", logInstall);
  await runner;
  loader.stop();
  console.log(`Dependencies installed ${chalk__default.default.green("successfully")}.`);
}
async function getStarterInfo(starter, { useYarn } = {}) {
  const isLocalStarter = ["./", "../", "/"].some((filePrefix) => starter.startsWith(filePrefix));
  let starterPath;
  let starterParentPath;
  let starterPackageInfo;
  if (isLocalStarter) {
    console.log("Installing local starter.");
    starterPath = path.resolve(starter);
  } else {
    starterPackageInfo = await getStarterPackageInfo(starter, { useYarn });
    console.log(`Installing ${chalk__default.default.yellow(starterPackageInfo.name)} starter.`);
    starterParentPath = await fse__default.default.mkdtemp(path.join(os__default.default.tmpdir(), "strapi-"));
    starterPath = await downloadNpmStarter(starterPackageInfo, starterParentPath, { useYarn });
  }
  return { isLocalStarter, starterPath, starterParentPath, starterPackageInfo };
}
async function buildStarter({ projectName, starter }, program2) {
  const hasYarnInstalled = hasYarn();
  const { isLocalStarter, starterPath, starterParentPath, starterPackageInfo } = await getStarterInfo(starter, { useYarn: hasYarnInstalled });
  const rootPath = path.resolve(projectName);
  const projectBasename = path.basename(rootPath);
  const starterJson = readStarterJson(path.join(starterPath, "starter.json"), starter);
  try {
    await fse__default.default.ensureDir(rootPath);
  } catch (error) {
    if (error instanceof Error) {
      stopProcess(`Failed to create ${chalk__default.default.yellow(rootPath)}: ${error.message}`);
    }
    stopProcess(`Failed to create ${chalk__default.default.yellow(rootPath)}: ${error}`);
  }
  const frontendPath = path.join(rootPath, "frontend");
  try {
    await fse__default.default.copy(path.join(starterPath, "starter"), frontendPath, {
      overwrite: true,
      recursive: true
    });
  } catch (error) {
    if (error instanceof Error) {
      stopProcess(`Failed to create ${chalk__default.default.yellow(frontendPath)}: ${error.message}`);
    }
    stopProcess(`Failed to create ${chalk__default.default.yellow(frontendPath)}`);
  }
  if (!isLocalStarter && starterParentPath) {
    await fse__default.default.remove(starterParentPath);
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
  await generateNew.generateNewApp(path.join(rootPath, "backend"), generateStrapiAppOptions);
  console.log(`Creating Strapi starter frontend at ${chalk__default.default.yellow(frontendPath)}.`);
  console.log("Installing frontend dependencies");
  await installWithLogs(frontendPath, { useYarn: hasYarnInstalled });
  initPackageJson(rootPath, projectBasename, { useYarn: hasYarnInstalled });
  try {
    const gitignore = path.join(__dirname, "..", "resources", "gitignore");
    await fse__default.default.copy(gitignore, path.join(rootPath, ".gitignore"));
  } catch (err) {
    logger.warn(`Failed to create file: ${chalk__default.default.yellow(".gitignore")}`);
  }
  await installWithLogs(rootPath, { useYarn: hasYarnInstalled });
  if (!ciEnv__default.default.isCI) {
    await initGit(rootPath);
  }
  console.log(chalk__default.default.green("Starting the app"));
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
  return inquirer__default.default.prompt(questions);
}
const packageJson = JSON.parse(node_fs.readFileSync(node_path.resolve(__dirname, "../package.json"), "utf8"));
const program = new commander__default.default.Command(packageJson.name);
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
  if (err instanceof commander.CommanderError) {
    if (err.exitCode && err.exitCode !== 0) {
      program.outputHelp();
    }
  }
}
//# sourceMappingURL=create-strapi-starter.js.map
