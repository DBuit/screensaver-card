[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

# Screensaver card
This card adds a screensaver to your interface which you can configure globally so the screensaver works global.
If you only wanna use it on a specific device you can use DeviceIDs from the browser_mod integration to add this functionality.

<a href="https://www.buymeacoffee.com/ZrUK14i" target="_blank"><img height="41px" width="167px" src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee"></a>

## Installation instructions

**HACS installation:**
Go to the hacs store and use the repo url `https://github.com/DBuit/screensaver-card` and add this as a custom repository under settings.

Add the following to your ui-lovelace.yaml:
```yaml
resources:
  url: /hacsfiles/screensaver-card/screensaver-card.js
  type: module
```

**Manual installation:**
Copy the .js file from the dist directory to your www directory and add the following to your ui-lovelace.yaml file:

```yaml
resources:
  url: /local/screensaver-card.js
  type: module
```

## Configuration

The YAML configuration happens at the root of your Lovelace config under sidebar: at the same level as resources: and views:. Example:

```
resources:
  - url: /local/screensaver-card.js?v=0.0.1
    type: module   
screensaver:
views:
....
```

### Main Options

Under sidebar you can configur the following options

| Name | Type | Default | Supported options | Description |
| -------------- | ----------- | ------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `digitalClock` | boolean | optional | `true` | Show digital clock in sidebar |
| `digitalClockWithSeconds` | boolean | optional | `true` | If digitalClock is enabled you can also enable to show seconds |
| `twelveHourVersion` | boolean | optional | `false` | If digitalClock is enabled you can also enable this to 12 hour version |
| `date` | boolean | optional | `false` | If date is enabled it will display the current date |
| `dateFormat` | boolean | string | `DD MMMM` | If date is enabled you define how it should show the date with dateFormat, to see the options check this url: https://momentjs.com/docs/#/parsing/string-format/ |
| `time` | integer | optional | `10` | After how much seconds it shows the screensaver (10 == 10 sec) |
| `deviceIds` | array | optional | `- a01cc804b906416b9133ea38aa074509` | If you don't want the screensaver on every device you can add a list of deviceIds where it should show the screensaver. (deviceIds are part of browser_mod integration) |
| `hideOnPath` | array | optional | `- /lovelace/camera` | If you don't want the screensaver on every path you can add a list of paths where it should hide the screensaver |

### Full example

```
screensaver:
  digitalClock: true
  digitalClockWithSeconds: false
  twelveHourVersion: false
  date: true
  dateFormat: 'DD MMMM'
  time: 10
  deviceIds:
    - b3104ac6-1d075c0b
    - bf3aa62a-f1d4bede
```


### Screenshots

<!-- ![Screenshot default](screenshot-default.png)
![Screenshot styled](screenshot-styled.png) -->