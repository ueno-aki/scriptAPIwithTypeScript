const [_node, _file, arg1] = process.argv;
const esbuild = require("esbuild");
const os = require("os");
const fs = require("fs-extra");

const manifest = JSON.parse(fs.readFileSync("./behavior_packs/template/manifest.json").toString("utf8"));
const project_name = manifest.header.name;
if (project_name === undefined) throw new Error("Failed to find your addon name.");

const mcdir =
    os.homedir() +
    "/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/";
const outFolder = "build/" + project_name + "/scripts/";
/** @type {esbuild.BuildOptions} */
const options = {
    bundle: true,
    outfile: outFolder + "main.js",
    target: "es6",
    format: "esm",
    minifyIdentifiers: true,
    minifyWhitespace: true,
    minifySyntax: true,
    entryPoints: ["scripts/main.ts"],
    tsconfig: "tsconfig.json",
    external: ["@minecraft/server", "@minecraft/server-ui", "@minecraft/common", "@minecraft/vanilla-data"],
};
if (arg1 === "watch") {
    options.watch = {
        onRebuild(err, res) {
            if (err) {
                console.error(err);
            } else {
                deployMCFolder();
            }
        },
    };
}
fs.emptyDir("./build/").then(() => {
    fs.copySync("./behavior_packs/template", "./build/" + project_name);
    esbuild
        .build(options)
        .then(() => {
            console.log(`success build [${new Date().getTime()}]`);
            deployMCFolder();
        })
        .catch((e) => {
            console.error(e);
        });
});

function deployMCFolder() {
    fs.copy("./build/" + project_name, mcdir + project_name, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(
                `Deploying "${project_name}" to "${mcdir}${project_name}" [${new Date().toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })}]`
            );
        }
    });
}
