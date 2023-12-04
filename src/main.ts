import {Plugin} from "obsidian";
import {DEFAULT_SETTINGS, OpenPluginSettings, PluginInfo} from "./interface";
import {ressources as resources, translationLanguage} from "./i18n/i18next";
import OpenPluginSettingTab from "./settings";
import i18next from "i18next";
import {OpenOtherPluginSettings} from "./modals";

export default class OpenPluginCmdr extends Plugin {
	settings: OpenPluginSettings;

	mobileContainers: HTMLElement[] = [];
	settingsResultsContainerEl = createDiv(
		"settings-search-results-container vertical-tab-content"
	);

	checkIfPluginIsEnabled(pluginId: string): boolean {
		//@ts-ignore
		return this.app.plugins.isEnabled(pluginId);
	}

	parseManifestAllPlugins(): PluginInfo[] {
		const plugins: PluginInfo[] = [];
		//@ts-ignore
		const manifestOfAllPlugins = this.app.plugins.manifests;
		for (const manifest in manifestOfAllPlugins) {
			if (!this.settings.pluginCmdr.find((p) => p.id === manifestOfAllPlugins[manifest].id) && this.checkIfPluginHasSettings(manifestOfAllPlugins[manifest].id)) {
				plugins.push({
					id: manifestOfAllPlugins[manifest].id,
					name: manifestOfAllPlugins[manifest].name
				});
			}
		}
		return plugins;
	}

	checkIfPluginHasSettings(pluginId: string): boolean {
		//@ts-ignore
		const allSettingsTab = this.app.setting.pluginTabs;
		return allSettingsTab.find((tab) => tab.id === pluginId) !== undefined;
	}

	async removeCommands()
	{
		//@ts-ignore
		const pluginCommands = Object.keys(this.app.commands.commands).filter((command) => command.startsWith("open-plugin-settings"));
		pluginCommands.forEach((command) => {
			const id = command.replace("open-plugin-settings:", "");
			if (this.settings.pluginCmdr.find((p) => p.id === id) === undefined) {
				console.log("remove command: " + command);
				//@ts-ignore
				this.app.commands.removeCommand(command);
			}
		});
	}

	/**
	 * Adds or removes commands if the settings changed
	 * @param oldPlugin {string | undefined} - the old folder path to remove the command
	 * @param newPlugin {PluginInfo | undefined} - the new folder to add the command
	 */
	async addNewCommands(
		oldPlugin: PluginInfo | undefined,
		newPlugin: PluginInfo | undefined,
	)
	{
		if (oldPlugin !== undefined) {
			//@ts-ignore
			this.app.commands.removeCommand(`open-plugin-settings:${oldPlugin.id}`); //doesn't work in some condition
		}
		if (newPlugin !== undefined && this.checkIfPluginIsEnabled(newPlugin.id) && this.checkIfPluginHasSettings(newPlugin.id)) {
			this.addCommand({
				id: `${newPlugin.id}`,
				name: `${newPlugin.name}`,
				callback: async () => {
					this.app.setting.open();
					this.app.setting.openTabById(newPlugin.id);
				}
			});
		}
	}

	/**
	 * Remove the plugins that are not enabled anymore*
	 */
	async removeDeletedPlugins() {
		const pluginsInfos = this.settings.pluginCmdr;
		//@ts-ignore
		const allPlugins = this.app.plugins.manifests;
		// if the plugin is deleted remove it from the settings
		// plugin deleted doesn't appear in the app.plugins.plugins
		pluginsInfos.forEach((pluginInfo) => {
			if (allPlugins[pluginInfo.id] === undefined) {
				this.settings.pluginCmdr = this.settings.pluginCmdr.filter((p) => p.id !== pluginInfo.id);
			}
		});
		const cmdrSettings: PluginInfo = {
			id: "open-plugin-settings",
			name: this.manifest.name,
		};
		if (this.settings.pluginCmdr.find((p) => p.id === cmdrSettings.id) === undefined) {
			this.settings.pluginCmdr.push(cmdrSettings);
		}
		await this.saveSettings();
	}

	/** refresh the commands list with removing disabled / deleted plugins and adding new ones */

	async refresh() {
		for (const plugin of this.settings.pluginCmdr) {
			await this.addNewCommands(undefined, plugin);
		}
	}

	async onload() {
		console.log(`Loading ${this.manifest.id} v${this.manifest.version}...`);
		await i18next.init({
			lng: translationLanguage,
			fallbackLng: "en",
			resources,
			returnNull: false,
		});
		await this.loadSettings();
		this.addSettingTab(new OpenPluginSettingTab(this.app, this));

		this.addCommand({
			id: "open-other-plugin-settings",
			name: i18next.t("openOther"),
			callback: () => {
				new OpenOtherPluginSettings(this.app, this, this.settings).open();
			}
		});
		await this.removeDeletedPlugins();
		await this.refresh();
	}

	onunload() {
		console.log(`Unloading ${this.manifest.id}...`);

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

