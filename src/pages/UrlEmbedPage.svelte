<!-- Javascript -->
<script>

  // Stores
  import { global, router } from '../js/global.js';

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
<iframe title={url} src={url} frameborder="0"></iframe>


<!-- CSS -->
<style>
  iframe {
    width: 100%;
    height: 100%;
  }
</style>