## Open Plugin Settings 

This plugin allow you to create a command to open the settings tabs of a specified plugin.

## Usage

By default, the settings of the plugin itself can be opened by the command palette, with using `Open Plugin Settings: Open Plugin Settings` command.

To add the command to open the settings of another plugin, just click on the adding button, and search the plugin you want to add.
After, you can use the command `Open Plugin Settings: Open <plugin name>` to open the settings of the plugin.

From the settings, you can also refresh the list to remove the deleted plugins and disable the commands of the disabled plugins.

![gif demo](https://user-images.githubusercontent.com/30244939/234854311-7da05061-2646-43c0-bd42-38fa50121d13.gif)


## 📥 Installation

- [ ] From Obsidian's community plugins
- [x] Using BRAT with `https://github.com/Lisandra-dev/open-plugin-settings-commands`
- [x] From the release page: 
  - Download the latest release
  - Unzip `open-plugin-settings-commands.zip` in `.obsidian/plugins/` path
  - In Obsidian settings, reload the plugin
  - Enable the plugin

## 🤖 Developing 
I use `npm` to develop this plugin : 
```
npm install
npm run dev
```

You can also create a `.env.json` file with the path to your main Obsidian Vault, as follows : 
```json
{
  "VAULT": "path/to/your/vault"
}
```

> **Note** 
> You need to duplicate the `\` if you are on Windows.

### 🎼 Languages

- [x] English
- [x] French

To add a translation:
- Fork the repository
- Add the translation in the `plugin/i18n/locales` folder with the name of the language (ex: `fr.json`)
- Copy the content of the [`en.json`](./plugin/i18n/locales/en.json) file in the new file
- Translate the content
- Create a pull request

## 📜 Credit

Thanks to [@pjeby/hotkey helper](https://github.com/pjeby/hotkey-helper) for the opening settings tabs.

<a href='https://ko-fi.com/X8X54ZYAV' target='_blank'><img height='36' style='border:0px;height:36px;display:block;margin-left:50%;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>  
