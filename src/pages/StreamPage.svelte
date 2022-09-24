<!-- Javascript -->
<script>

  // Stores
  import { global, router } from '../js/global.js';
  import { onMount } from 'svelte';

  // Configuration
  export let config = {
    "name": "Stream",
    "file": "StreamPage",
    "mjpeg": "http://192.168.1.21/cgi-bin/mjpg/video.cgi?channel=0&subtype=1",
    "hls": "https://stream.trey.app/src/stream/output.m3u8"
  }

  // Variables
  let hlsPlayer
  onMount(() => {
    hslStream('https://stream.trey.app/src/stream/output.m3u8', hlsPlayer)
  })

  // Functions
  function hslStream(src, element) {
    const video = element
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }

  // Debug
  $: console.log("config", config)

</script>

<!-- HTML -->
{#if config.mjpeg}  
  <img 
    src={config.mjpeg} 
    alt="mjpeg stream"
    nocontrols
    style="
      {$global.screen.portrait ? "width: 100%;" : "height: 100%;"}
      background-color: black;
      border-radius: var(--radius-2);
    "
  >
{:else if config.hls}
  <video 
    bind:this={hlsPlayer}
    nocontrols
    autoplay="autoplay" 
    xloop="loop" 
    muted defaultMuted 
    playsinline 
    preload="auto"
    style="
      {$global.screen.portrait ? "width: 100%;" : "height: 100%;"}
      background-color: black;
      border-radius: var(--radius-2);
    "
  ></video>
{/if}

<!-- CSS -->
<style>

</style>