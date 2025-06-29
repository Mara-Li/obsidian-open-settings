/** Plugin settings tabs **/

import { App, Notice, PluginSettingTab, Setting } from "obsidian";
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
		containerEl.addClass("open-plugin-settings-tab");

		containerEl.createEl("p", { text: i18next.t("settingsTab.desc"), cls: "center" })

		new Setting(containerEl)
			.setName(i18next.t("sleepingTime.title"))
			.setDesc(i18next.t("sleepingTime.desc"))
			.addText((text) => {
				text
					.setValue(
						this.plugin.settings.sleepingTime?.toString() ?? "300"
					)
					.inputEl.onblur = () => {
						const value = text.inputEl.value;
						const newValue = parseInt(value);
						if (isNaN(newValue) || newValue < 0) {
							new Notice(i18next.t("sleepingTime.error", { value }));
							text.setValue(this.plugin.settings.sleepingTime?.toString() ?? "300");
						}
						else {
							this.plugin.settings.sleepingTime = newValue;
							text.setValue(newValue.toString());
							this.plugin.saveSettings();
						}
					}
			})


		const buttonSettings = new Setting(containerEl).setClass(
			"open-plugin-settings-header"
		)

		buttonSettings.addButton((button) =>
			button
				.setButtonText(i18next.t("settingsTab.addNew"))

				.onClick(async () => {
					//open the search modal
					const searchModal = new SearchInAllPlugins(
						this.app,
						this.plugin,
						async (result) => {
							//add the plugin to the list
							this.plugin.settings.pluginCmdr.push(result);
							await this.plugin.saveSettings();
							await this.plugin.addNewCommands(undefined, result);
							this.display();
						}
					);
					searchModal.open();
				})
				.setClass("add-plugin-button")
		)
		buttonSettings.addExtraButton((button) =>
			button
				.setIcon("reset")
				.setTooltip(i18next.t("settingsTab.refresh"))
				.onClick(async () => {
					//refresh the list of plugins
					await this.plugin.removeDeletedPlugins();
					this.display();
				})
		);

		for (const plugin of this.plugin.settings.pluginCmdr) {
			const pluginSettings = new Setting(containerEl)
				.setName(plugin.name)
				.addExtraButton((button) => button.setIcon("pencil").setDisabled(true))
				.addText((text) => {
					text.setValue(plugin.commandName ?? plugin.name).onChange(async (value) => {
						//change the name of the commands
						const oldPlugin = JSON.parse(JSON.stringify(plugin));
						plugin.commandName = value;
						await this.plugin.saveSettings();
						await this.plugin.addNewCommands(oldPlugin, plugin);
					}).inputEl.ariaLabel = i18next.t("settingsTab.commandName");
					this.addTooltip(i18next.t("settingsTab.commandName"), text.inputEl);
				})
				.setClass("open-plugin-settings-item")
				.addButton((button) =>
					button
						.setIcon("trash")
						.setTooltip(i18next.t("settingsTab.remove"))
						.onClick(async () => {
							//remove the plugin from the list
							this.plugin.settings.pluginCmdr = this.plugin.settings.pluginCmdr.filter(
								(p) => p.id !== plugin.id
							);
							await this.plugin.saveSettings();
							this.plugin.removeCommand(plugin.id);

							this.display();
						})
				);
			if (!this.plugin.checkIfPluginIsEnabled(plugin.id)) {
				pluginSettings.setDesc(i18next.t("settingsTab.disabled")).setClass("disabled");
			}
		}
	}

	addTooltip(text: string, cb: HTMLElement) {
		cb.onfocus = () => {
			const tooltip = cb.parentElement?.createEl("div", { text, cls: "tooltip" });
			if (tooltip) {
				const rec = cb.getBoundingClientRect();
				tooltip.style.top = `${rec.top + rec.height + 5}px`;
				tooltip.style.left = `${rec.left + rec.width / 2}px`;
			}
		};
		cb.onblur = () => {
			cb.parentElement?.querySelector(".tooltip")?.remove();
		};
	}
}
