export interface OpenPluginSettings {
    pluginCmdr: PluginInfo[];
}

export const DEFAULT_SETTINGS: OpenPluginSettings = {
    pluginCmdr: [{
        id: "open-plugin-settings",
        name: "Open Plugin Settings",
    }]
};

export interface PluginInfo {
    id: string;
    name: string;
}

