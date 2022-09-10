# What is this

This project uses Svelte (JavaScript/HTML Framwork) to make a touch panel UI for Crestron touch panels.


#### Note: VC-4 needs the websocket port (default 10000) though the firewall

https://linuxconfig.org/how-to-disable-enable-firewall-on-almalinux#:~:text=How%20to%20permanently%20enable%20or,above%2C%20will%20permanently%20disable%20firewalld.

https://linuxconfig.org/how-to-allow-port-through-firewall-on-almalinux

```
sudo systemctl stop firewalld
```
```
sudo systemctl start firewalld
```
```
sudo systemctl disable firewalld
```
```
sudo systemctl enable firewalld
```


# Setup

install Node.js from https://nodejs.org/ (16.16.0)
open a terminal to the root folder of this project


# Install dependancies

install all the dependancies with the following command

```
npm install
```


# Run

start project locally

```
npm run dev
```

or host it so anyone can get to it at your IP

```
npm run dev-host
```

Control+C to stop running the project


# Build and Archive

run this to build the svelte project and make the .ch5z file

```
npm run archive
```


# To change the config files
1. Look in ./public/configs for example config files
2. Load the config by pointing to it in the URL
3. If you want to use the config file ./public/configs/examples/small.json and your processors IP is 192.168.1.1
4. Your URL would be http://192.168.1.1/html/index.html?config=examples/small.json
5. The file ./public/configs/config.json is the default config and will be used if no config file is specified 


# Icons
1. Icons are Material Symbols (Rounded + Filled)
2. https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols
3. Find the Icon you want and copy the name
4. If there is a space in the name remove it and put an underscore in its place
5. Example: "Mic Off" becomes "mic_off"


# To add a custom page

1. Make a page file in ./src/pages
2. Add page to "pageFiles" array in ./App.svelte 
3. Add page to pages in config.json
4. Add to activity page or quick access top bar


# VC-4 Text Console
```
journalctl -u virtualcontrol -f --all
```
