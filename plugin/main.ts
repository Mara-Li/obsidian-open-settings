import { Plugin} from 'obsidian';
import { DEFAULT_SETTINGS, OpenPluginSettings, PluginInfo } from './interface';
import { ressources, translationLanguage } from "./i18n/i18next";
import OpenPluginSettingTab from './settings';
import i18next from 'i18next';

export default class OpenPluginCmdr extends Plugin {
	settings: OpenPluginSettings;

	mobileContainers: HTMLElement[] = [];
	settingsResultsContainerEl = createDiv(
		"settings-search-results-container vertical-tab-content"
	);

	checkIfPluginIsEnabled(pluginId: string): boolean {
		//@ts-ignore
		const allEnabledPlugins = this.app.plugins.enabledPlugins as Set<string>;
		return allEnabledPlugins.has(pluginId);
	}

	checkIfPluginHasSettings(pluginId: string): boolean {
		//@ts-ignore
		const plugin = app.plugins.plugins[pluginId];
		return plugin?.settings !== undefined;
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
				app.commands.removeCommand(command);
			}
		})
	}

		/**
	 * Adds or removes commands if the settings changed
	 * @param oldPlugin {string | undefined} - the old folder path to remove the command
	 * @param newPlugin {FolderSettings | undefined} - the new folder to add the command
	 */
	async addNewCommands(
		oldPlugin: PluginInfo | undefined,
		newPlugin: PluginInfo | undefined,
	)
	{
		if (oldPlugin !== undefined) {
			//@ts-ignore
			app.commands.removeCommand(`open-plugin-settings:${oldPlugin.id}`); //doesn't work in some condition
		}
		if (newPlugin !== undefined && this.checkIfPluginIsEnabled(newPlugin.id) && this.checkIfPluginHasSettings(newPlugin.id)) {
			this.addCommand({
				id: `${newPlugin.id}`,
				name: `${newPlugin.name}`,
				callback: async () => {
					app.setting.open();
					app.setting.openTabById(newPlugin.id);
				}
			});
		}
	}

	openSettings(plugin: PluginInfo) {
		//@ts-ignore
		this.app.setting.openTabByID(plugin.id);
	}	

	async onload() {
		console.log(`Loading ${this.manifest.id} v${this.manifest.version}...`);
		i18next.init({
			lng: translationLanguage,
			fallbackLng: "en",
			resources: ressources,
			returnNull: false,
		});
		await this.loadSettings();
		this.addSettingTab(new OpenPluginSettingTab(this.app, this));
		for (const plugin of this.settings.pluginCmdr) {
			this.addNewCommands(undefined, plugin);
		}
		
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

