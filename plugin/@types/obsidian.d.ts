import { SettingTab } from "obsidian";


declare module "obsidian" {
	interface App {
		setting: {
			onOpen(): void;
			onClose(): void;
			open(): void;
			openTabById(id: string): SettingTab | null;
			openTab(tab: SettingTab): void;

			isPluginSettingTab(tab: SettingTab): boolean;
			addSettingTab(tab: SettingTab): void;
			removeSettingTab(tab: SettingTab): void;

			activeTab: SettingTab;
			lastTabId: string;

			pluginTabs: PluginSettingTab[];
			settingTabs: SettingTab[];

			tabContentContainer: HTMLDivElement;
			tabHeadersEl: HTMLDivElement;
		};
	}
}