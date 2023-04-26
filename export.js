// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const envFile = path.join(__dirname, ".env.json");
const env = JSON.parse(fs.readFileSync(envFile, "utf8"));
const VAULT = env['VAULT'];
if (!VAULT || VAULT.trim().length === 0) {
	console.error("Please set VAULT in .env.json");
	process.exit(1);
}
const pluginDir = path.join(VAULT, ".obsidian", "plugins", "open-plugin-settings");

if (!fs.existsSync(pluginDir)) {
	console.log("Creating plugin directory");
	fs.mkdirSync(pluginDir);
}

console.log(`Copying plugin in ${pluginDir}`);

fs.copyFileSync('main.js', path.join(pluginDir, 'main.js'));
fs.copyFileSync('manifest.json', path.join(pluginDir, 'manifest.json'));
if (fs.existsSync('./styles.css')) {
	fs.copyFileSync('./styles.css', path.join(pluginDir, 'styles.css'));
}
console.log("Plugin copied to your main vault. Please reload the plugin to see changes.")
