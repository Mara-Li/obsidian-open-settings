## Open Plugin Settings

This plugin allows you to create a command to open the settings tabs of a specified plugin.

### Usage

By default, you can open the settings of the plugin itself using the command palette with the `Open Plugin Settings: Open Plugin Settings` command.

To add a command to open the settings of another plugin, click on the add button and search for the plugin you want to add. After that, you can use the command `Open Plugin Settings: Open <plugin name>` to open the settings of the plugin.

From the settings, you can also refresh the list to remove deleted plugins and disable commands of disabled plugins.

![gif demo](https://user-images.githubusercontent.com/30244939/234854311-7da05061-2646-43c0-bd42-38fa50121d13.gif)

### 📥 Installation

- [x] From Obsidian's community plugins
- [x] Using BRAT with `https://github.com/Lisandra-dev/open-plugin-settings-commands`
- [x] From the release page:
  - Download the latest release.
  - Unzip `open-plugin-settings-commands.zip` in the `.obsidian/plugins/` path.
  - In Obsidian settings, reload the plugin.
  - Enable the plugin.

### 🤖 Developing
To develop this plugin, I use `npm`. Follow these steps:
```
npm install
npm run dev
```

You can also create a `.env.json` file with the path to your main Obsidian Vault, as follows:
```json
{
  "VAULT": "path/to/your/vault"
}
```

> **Note:**  
> If you are on Windows, you need to duplicate the `\` in the file path.

### 🎼 Languages

- [x] English
- [x] French

To add a translation:
- Fork the repository.
- Add the translation in the `plugin/i18n/locales` folder with the name of the language (e.g., `fr.json`).
- Copy the content of the [`en.json`](./plugin/i18n/locales/en.json) file into the new file.
- Translate the content.
- Create a pull request.

### 📜 Credit

Thanks to [@pjeby/hotkey helper](https://github.com/pjeby/hotkey-helper) for the opening settings tabs.
