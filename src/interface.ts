export interface OpenPluginSettings {
    pluginCmdr: PluginInfo[];
}

export const DEFAULT_SETTINGS: OpenPluginSettings = {
	pluginCmdr: [{
		id: "open-plugin-settings",
		name: "Open Plugin Settings",
		commandName: "Open Plugin Settings"
	}]
};

export interface PluginInfo {
	id: string;
    name: string;
	commandName: string;
}

export interface CorePlugins {
	[id: string]: boolean;
}