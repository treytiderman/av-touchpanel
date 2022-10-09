<!-- Javascript -->
<script>

  // Stores
  import { global } from '../js/global.js';
  import { onMount } from 'svelte';

  // Configuration
  export let config = {
    "name": "Stream",
    "file": "StreamPage",
    "mjpeg": "http://192.168.1.21/cgi-bin/mjpg/video.cgi?channel=0&subtype=1",
    "hls": "http://192.168.1.1:19000/memfs/a22dfe17-c714-459e-b2d5-7c252093d445.m3u8",
    "ws": "ws://192.168.1.1:9999"
  }

  // Variables
  let wsPlayer
  let hlsPlayer
  onMount(() => {
    if (config.ws) wsStream(config.ws, wsPlayer)
    else if (config.hls) hslStream(config.hls, hlsPlayer)
  })

  // Functions
  function wsStream(src, element) {
    return new JSMpeg.Player(src, {canvas: element})
  }
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
<section>
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
  {:else if config.ws}
    <canvas 
      bind:this={wsPlayer}
      style="
        {$global.screen.portrait ? "width: 100%;" : "height: 100%;"}
        background-color: black;
        border-radius: var(--radius-2);
      "
    ></canvas>
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
</section>

<!-- CSS -->
<style>
  section {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  /* canvas, */
  img,
  video {
    /* max-height: 100%; */
    /* max-width: 100%; */
    /* display: block; */
  }
  canvas {
    /* height: min-content; */
    /* min-width: 50vw; */
    /* width: 100%; */
    /* flex-grow: 1; */
  }
</style>