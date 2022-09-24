<!-- Javascript -->
<script>

  // Stores
  import { onMount } from 'svelte';
  import { default as QrCode } from 'qrious';

  // Configuration
  export let config = {
    "name": "Stream",
    "file": "StreamPage",
    "heading": "",
    "url": "",
    "wifi": {
      "ssid": "",
      "auth": "WPA", // WEP, WPA, WPA2-EAP, nopass
      "password": "",
      "hidden": false,
    }
  }
  
  // Variables
  let heading = config.heading
  let url = config.url
  let wifi = config.wifi
  if (wifi && wifi.ssid !== "") url = `WIFI:T:${wifi.auth};S:${wifi.ssid};P:${wifi.password};H:${wifi.hidden};;`
  
  // Functions
  let qrCodeImage = ''
  const QRcode = new QrCode()
  function generateQrCode() {
    QRcode.set({
      background: "#FFF",
      foreground: "#000",
      level: "Q", // L, M, Q, H
      padding: 0,
      size: "300",
      value: url,
    })
    qrCodeImage = QRcode.toDataURL('image/png')
  }

  // Dynamic Variables
  $: if (url) generateQrCode()
  
  // Debug
  $: console.log("config", config)
  
</script>

<!-- HTML -->
<section>
  {#if heading && heading !== ""}
    <h4>{heading}</h4>
  {/if}
  {#if wifi && wifi.ssid !== ""}
    <p>
      SSID: {wifi.ssid} <br>
      PASS: {wifi.password}
    </p>
  {:else if url}
    <p>
      URL:
      <a href={url}>{url}</a>
    </p>
  {/if}
  <img src={qrCodeImage} alt={url}/>
</section>

<!-- CSS -->
<style>
  section {
    display: grid;
    gap: var(--gap);
  }
  img {
    background-color: #FFF;
    border-radius: var(--radius-2);
    padding: var(--pad);
    border: var(--border);
    border-color: black;
  }
  a {
    text-decoration: underline;
  }
</style>