export interface OpenPluginSettings {
    pluginCmdr: PluginInfo[];
}

export const DEFAULT_SETTINGS: OpenPluginSettings = {
    pluginCmdr: []
};

export interface PluginInfo {
    id: string;
    name: string;
}

