<!-- Javascript -->
<script>

  // Stores
  import { global } from '../js/global.js';

  // Configuration
  export let config = {
    "name": "YouTube",
    "file": "UrlEmbedPage",
    "url": "https://www.google.com/"
  }

  // Components
  // import Keypad from '../components/Keypad.svelte'

  // Variables
  let url = config.url

  // Debug
  $: console.log("config", config)

</script>

<!-- HTML -->
<embed title={url} src={url} type="application/pdf">

<!-- CSS -->
<style>
  embed {
    width: 100%;
    height: 100%;
    background-color: black;
  }
</style>