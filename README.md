# AV-Touchpanel

- Config based av-touchpanel ui for any backend processor / core / server
    - [x] Crestron (SIMPL, 3 or 4 series processors, TSW-x60 and newer touch panels)
    - [ ] QSC (Q-SYS Designer)
    - [ ] AMX (Muse)
    - [ ] Universal (WebSocket)

Demo: [av-touchpanel](https://trey.app/av-touchpanel/?config=tp1&edit=y

Demo-Old: [av-touchpanel-old](https://trey.app/av-touchpanel-old


## Crestron VC4 Setup

1. Create token in VC4 "Settings" for use as XPanel authentication
2. Unzip ./simpl/av-touchpanel_compiled.zip
3. Load ./simpl/av-touchpanel.lpz and ./archive/av-touchpanel.ch5z to VC4
4. Go to XPanel URL and update backend details
    - Example: http://192.168.1.72/VirtualControl/Rooms/2/XPanel/index.html?config=tp1&edit=true
    - VC4 Config File Location: /opt/crestron/virtualcontrol/RunningPrograms/2/XPanel/tp1.json


### XPanel Security Note

- You have to go to https://<IP>:49200 and accept the self-signed certificate before secure WebSocket works
    - Example: https://192.168.1.72:49200
- More Info
    - https://sdkcon78221.crestron.com/sdk/Crestron_HTML5UI/Content/Topics/Platforms/X-CS-SSC.htm
    - https://docs.crestron.com/en-us/8912/Content/Topics/Reference/HTML5-XPanel.htm


<!--## QSC (Q-SYS Designer) Setup-->

<!--## Universal (WebSocket) Setup-->


## Development

### Live Development

```sh
# Install dependencies
npm install

# Run dev server
npm run dev
```


### Create Archive

```sh
# Install dependencies
npm install

# Build
npm run build

# Archive
npm run archive
```

## TODO

- [ ] assume &config=tp1 is always there. if it is not then show a message to the user
