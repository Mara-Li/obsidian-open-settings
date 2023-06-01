/**
 * Search all installed plugins and register the plugin choosen with :
 * - plugin ID 
 * - plugin name
 */

import {App, FuzzySuggestModal} from "obsidian";
import { PluginInfo } from "./interface";
import OpenPluginCmdr from "./main";


export class SearchInAllPlugins extends FuzzySuggestModal<PluginInfo> {
    result: PluginInfo;
    plugin: OpenPluginCmdr;
    onSubmit: (result: PluginInfo) => void;


    parseManifestAllPlugins(): PluginInfo[] {
        const plugins: PluginInfo[] = [];
        //@ts-ignore
        const manifestOfAllPlugins = this.app.plugins.manifests;
        for (const manifest in manifestOfAllPlugins) {
            if (!this.plugin.settings.pluginCmdr.find((p) => p.id === manifestOfAllPlugins[manifest].id) && this.plugin.checkIfPluginHasSettings(manifestOfAllPlugins[manifest].id)) {
                plugins.push({
                    id: manifestOfAllPlugins[manifest].id,
                    name: manifestOfAllPlugins[manifest].name
                });
            }
        }
        return plugins;
    }

    constructor(app: App, plugin: OpenPluginCmdr, onSubmit: (result: PluginInfo) => void) {
        super(app);
        this.onSubmit = onSubmit;
        this.plugin = plugin;
    }

    getItems(): PluginInfo[] {
        return this.parseManifestAllPlugins();
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