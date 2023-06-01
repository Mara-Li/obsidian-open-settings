/** Plugin settings tabs **/

import { App, PluginSettingTab, Setting } from "obsidian";
import OpenPluginCmdr from "./main";
import { SearchInAllPlugins } from "./modals";
import i18next from "i18next";

export default class OpenPluginSettingTab extends PluginSettingTab {
	plugin: OpenPluginCmdr;

	constructor(app: App, plugin: OpenPluginCmdr) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: i18next.t("settingsTab.title")});
		containerEl.createEl("p", { text: i18next.t("settingsTab.desc")});

		const buttonSettings = new Setting(containerEl)
			.setClass("open-plugin-settings-header");
		buttonSettings.addButton((button) =>
			button
				.setButtonText(i18next.t("settingsTab.addNew"))
				.onClick(async () => {
					//open the search modal
					const searchModal = new SearchInAllPlugins(this.app, this.plugin, async (result) => {
						//add the plugin to the list
						this.plugin.settings.pluginCmdr.push(result);
						await this.plugin.saveSettings();
						await this.plugin.addNewCommands(undefined, result);
						this.display();
					});
					searchModal.open();
				})
				.setClass("add-plugin-button")
		)
			.infoEl.style.display = "none";
		buttonSettings.addExtraButton((button) =>
			button
				.setIcon("reset")
				.setTooltip(i18next.t("settingsTab.refresh"))
				.onClick(async () => {
					//refresh the list of plugins
					await this.plugin.removeDeletedPlugins();
					await this.plugin.refresh();
					this.display();
				})
		);


		for (const plugin of this.plugin.settings.pluginCmdr) {
			const pluginSettings = new Setting(containerEl)
				.setName(plugin.name)
				.setClass("open-plugin-settings-item")
				.addButton((button) =>
					button
						.setIcon("trash")
						.setTooltip(i18next.t("settingsTab.remove"))
						.onClick(async () => {
							//remove the plugin from the list
							this.plugin.settings.pluginCmdr = this.plugin.settings.pluginCmdr.filter((p) => p.id !== plugin.id);
							await this.plugin.saveSettings();
							await this.plugin.removeCommands();

							this.display();
						})
				);
			if (!this.plugin.checkIfPluginIsEnabled(plugin.id)) {
				pluginSettings
					.setDesc(i18next.t("settingsTab.disabled"))
					.setClass("disabled");
			}
		}
	}

    


}
