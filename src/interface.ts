export interface OpenPluginSettings {
	sleepingTime?: number; // Time in milliseconds to wait before refreshing the plugin list
	pluginCmdr: PluginInfo[];
}

export const DEFAULT_SETTINGS: OpenPluginSettings = {
	sleepingTime: 300, // Default time to wait before refreshing the plugin list
	pluginCmdr: [
		{
			id: "open-plugin-settings",
			name: "Open Plugin Settings",
			commandName: "Open Plugin Settings",
		},
	],
};

export interface PluginInfo {
	id: string;
	name: string;
	commandName: string;
}

export interface CorePlugins {
	[id: string]: boolean;
}
