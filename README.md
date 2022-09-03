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

# To add a custom page

1. Make a page file in ./src/pages
2. Add page to ./App.svelte
3. Add page to config.json
