import {Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, OpenPluginSettings, PluginInfo} from './interface';
import {ressources, translationLanguage} from "./i18n/i18next";
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
		const allSettingsTab = app.setting.pluginTabs;
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

	/**
	 * Remove the plugins that are not enabled anymore
	 * @param settings {OpenPluginSettings} - the complete settings object
	 *
	 */
	async removeDeletedPlugins() {
		const pluginsInfos = this.settings.pluginCmdr;
		//@ts-ignore
		const allPlugins = this.app.plugins.manifests;
		console.log(allPlugins);
		// if the plugin is deleted remove it from the settings
		// plugin deleted doesn't appear in the app.plugins.plugins
		pluginsInfos.forEach((pluginInfo) => {
			if (allPlugins[pluginInfo.id] === undefined) {
				this.settings.pluginCmdr = this.settings.pluginCmdr.filter((p) => p.id !== pluginInfo.id);
			}
		});
		const cmdrSettings: PluginInfo = {
			id: "open-plugin-settings",
			name: "Open Plugin Settings",
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
			resources: ressources,
			returnNull: false,
		});
		await this.loadSettings();
		this.addSettingTab(new OpenPluginSettingTab(this.app, this));
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

