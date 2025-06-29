import { Plugin } from "obsidian";
import {
	CorePlugins,
	DEFAULT_SETTINGS,
	OpenPluginSettings,
	PluginInfo,
} from "./interface";
import { ressources as resources, translationLanguage } from "./i18n/i18next";
import OpenPluginSettingTab from "./settings";
import i18next from "i18next";
import { OpenOtherPluginSettings } from "./modals";
import type { InternalPluginNameType } from "obsidian-typings";

export default class OpenPluginCmdr extends Plugin {
	settings!: OpenPluginSettings;

	mobileContainers: HTMLElement[] = [];
	settingsResultsContainerEl = createDiv(
		"settings-search-results-container vertical-tab-content"
	);

	checkIfPluginIsEnabled(pluginId: string): boolean {
		const loadPlugin = this.app.plugins.getPlugin(pluginId);
		return loadPlugin?._loaded ?? false;
	}

	parseManifestAllPlugins(): PluginInfo[] {
		const plugins: PluginInfo[] = [];
		//@ts-ignore
		const manifestOfAllPlugins = this.app.plugins.manifests;
		//@ts-ignore
		const officialPlugins = this.app.internalPlugins.config as CorePlugins;
		for (const manifest in manifestOfAllPlugins) {
			if (
				!this.settings.pluginCmdr.find(
					(p) => p.id === manifestOfAllPlugins[manifest].id
				) &&
				this.checkIfPluginHasSettings(manifestOfAllPlugins[manifest].id)
			) {
				plugins.push({
					id: manifestOfAllPlugins[manifest].id,
					name: manifestOfAllPlugins[manifest].name,
					commandName: manifestOfAllPlugins[manifest].name,
				});
			}
		}
		const core = Object.entries(officialPlugins);
		for (const [id, enabled] of core) {
			const coreConfig = this.coreConfig(id as InternalPluginNameType);
			if (
				enabled &&
				!this.settings.pluginCmdr.find((p) => p.id === id) &&
				this.checkIfPluginHasSettings(id) &&
				coreConfig
			) {
				plugins.push(coreConfig);
			}
		}
		return plugins;
	}

	checkIfPluginHasSettings(pluginId: string): boolean {
		const allSettingsTab = this.app.setting.pluginTabs;
		return allSettingsTab.find((tab) => tab.id === pluginId) !== undefined;
	}

	/**
	 * Adds or removes commands if the settings changed
	 * @param oldPlugin {string | undefined} - the old folder path to remove the command
	 * @param newPlugin {PluginInfo | undefined} - the new folder to add the command
	 */
	async addNewCommands(
		oldPlugin: PluginInfo | undefined,
		newPlugin: PluginInfo | undefined
	) {
		if (oldPlugin !== undefined) {
			this.removeCommand(`${oldPlugin.id}`);
		}
		if (
			newPlugin !== undefined &&
			this.checkIfPluginIsEnabled(newPlugin.id) &&
			this.checkIfPluginHasSettings(newPlugin.id)
		) {
			this.addCommand({
				id: `${newPlugin.id}`,
				name: `${newPlugin.commandName ?? newPlugin.name}`,
				callback: async () => {
					this.app.setting.open();
					this.app.setting.openTabById(newPlugin.id);
				},
			});
		}
	}

	coreConfig(id: InternalPluginNameType): PluginInfo | undefined {
		if (this.app.internalPlugins.getPluginById(id) !== undefined) {
			const instance = this.app.internalPlugins.getPluginById(id)?.instance;
			if (instance)
				return {
					id,
					name: instance.name,
					commandName: instance.name,
				};
		}
		return undefined;
	}

	/**
	 * Remove the plugins that are not enabled anymore*
	 */
	async removeDeletedPlugins() {
		const pluginsInfos = this.settings.pluginCmdr;
		const allPlugins = this.app.plugins.manifests;
		// if the plugin is deleted remove it from the settings
		// plugin deleted doesn't appear in the app.plugins.plugins
		pluginsInfos.forEach((pluginInfo) => {
			if (
				allPlugins[pluginInfo.id] === undefined &&
				!this.coreConfig(pluginInfo.id as InternalPluginNameType)
			) {
				this.settings.pluginCmdr = this.settings.pluginCmdr.filter(
					(p) => p.id !== pluginInfo.id
				);
			}
		});
		const cmdrSettings: PluginInfo = {
			id: "open-plugin-settings",
			name: this.manifest.name,
			commandName: this.manifest.name,
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

		this.app.workspace.onLayoutReady(async () => {
			this.addCommand({
				id: "open-other-plugin-settings",
				name: i18next.t("openOther"),
				callback: () => {
					new OpenOtherPluginSettings(this.app, this, this.settings).open();
				},
			});
			await sleep(this.settings.sleepingTime ?? 300);
			await this.removeDeletedPlugins();
			await this.refresh();
		});
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
