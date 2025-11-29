# CH5 Svelte Template Project

- Crestron CH5 Template using Svelete as the JS framework
- CH5 projects work on 3 or 4 series processors and tsw-x60 and newer touch panels


## VC4 Setup

1. Create token in VC4 settings for XPanel auth
2. Update ./src/App.svelte info: ip, ipid, roomid, token
3. [Create Archive](#create-archive)
4. Unzip ./simpl/av-touchpanel_compiled.zip
5. Load ./simpl/av-touchpanel.lpz and ./archive/av-touchpanel.ch5z to VC4 (Room ID: 1)
6. Go to XPanel URL in room details
    - Example: http://192.168.1.72/VirtualControl/Rooms/1/XPanel/index.html
    - Or add URL params to change ip, ipid, roomid, token
    - Example: http://192.168.1.72/VirtualControl/Rooms/1/XPanel/index.html?ip=192.168.1.99&ipid=0x03&roomid=1&token=longtokenstringfromvc4


## Create Archive

```sh
# Install dependencies
npm install

# Build
npm run build

# Archive
npm run archive
```


## Live Development

```sh
# Install dependencies
npm install

# Run dev server
npm run dev
```

