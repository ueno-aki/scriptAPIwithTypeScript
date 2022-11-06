const BPFolderName = "_test";

const esbuild = require("esbuild");
const os = require("os");
const fs = require("fs-extra");

const mcdir =
    os.homedir() +
    "/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/";
const outFile = "build/" + BPFolderName + "/scripts/";
const [node, file, watchEnable] = process.argv;
const options = {
    bundle: true,
    outfile: outFile + "main.js",
    target: "es6",
    format: "esm",
    minifyIdentifiers: true,
    minifyWhitespace: true,
    minifySyntax: true,
    entryPoints: ["scripts/main.ts"],
    tsconfig: "tsconfig.json",
    external: ["@minecraft/server", "@minecraft/server-ui"],
};
if (watchEnable === "watch") {
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
fs.emptyDir("./" + outFile).then(async () => {
    fs.copySync("./behavior_packs/" + BPFolderName, "./build/" + BPFolderName);
    esbuild.build(options).then(() => {
        deployMCFolder();
    });
});

function deployMCFolder() {
    console.log(`success build [${new Date().getTime()}]`);
    fs.copy("./build/" + BPFolderName, mcdir + BPFolderName, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`deploying "${BPFolderName}" to "${mcdir}${BPFolderName}"`);
        }
    });
}
