/**
 * Search all installed plugins and register the plugin choosen with :
 * - plugin ID 
 * - plugin name
 */

import {App, FuzzySuggestModal} from "obsidian";
import {OpenPluginSettings, PluginInfo} from "./interface";
import OpenPluginCmdr from "./main";


export class SearchInAllPlugins extends FuzzySuggestModal<PluginInfo> {
	result: PluginInfo;
	plugin: OpenPluginCmdr;
	onSubmit: (result: PluginInfo) => void;
	
	constructor(app: App, plugin: OpenPluginCmdr, onSubmit: (result: PluginInfo) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.plugin = plugin;
	}

	getItems(): PluginInfo[] {
		return this.plugin.parseManifestAllPlugins();
	}

	getItemText(item: PluginInfo): string {
		return item.name;
	}

	onChooseItem(item: PluginInfo, evt: MouseEvent | KeyboardEvent): void {
		this.result = item;
		this.onSubmit(this.result);
		this.close();
	}

	onClose(): void {
		const {contentEl} = this;
		contentEl.empty();
	}
}

export class OpenOtherPluginSettings extends FuzzySuggestModal<PluginInfo> {
	plugin: OpenPluginCmdr;
	settings: OpenPluginSettings;
	
	constructor(app: App, plugin: OpenPluginCmdr, settings: OpenPluginSettings) {
		super(app);
		this.plugin = plugin;
		this.settings = settings;
	}
	
	getItems(): PluginInfo[] {
		return this.plugin.parseManifestAllPlugins();
	}
	
	getItemText(item: PluginInfo): string {
		return item.name;
	}
	
	onChooseItem(item: PluginInfo, evt: MouseEvent | KeyboardEvent): void {
		//open the settings of the plugin
		this.app.setting.open();
		this.app.setting.openTabById(item.id);
	}
}
