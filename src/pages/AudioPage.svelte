<!-- Javascript -->
<script>

  // Stores
  import { global, router } from '../js/global.js';

  // Configuration
  export let config = {
    "name": "Audio",
    "file": "AudioPage",
    "SIMPL": {
      "ip": "192.168.1.9",
      "port": 10000,
      "path": "AudioPage"
    },
    "volumes": [
      {
        "id": 1,
        "label": "Video",
        "type": "slider",
        "iconMic": false,
        "value": 0,
        "max": 6,
        "min": -24,
        "units": "dB"
      },
      {
        "id": 2,
        "label": "TV",
        "type": "slider",
        "iconMic": false,
        "value": 5,
        "max": 10,
        "min": 0,
        "units": "/ 10"
      },
      {
        "id": 3,
        "label": "Wireless Microphone",
        "type": "slider",
        "value": 75,
        "iconMic": true
      },
      {
        "id": 4,
        "label": "Privacy",
        "iconMic": true,
        "type": "mute"
      }
    ]
  }
  
  // Components
  import SliderMute from "../components/SliderMute.svelte";
  import Mute from "../components/Mute.svelte";
  
  // Variables
  let volumes = config.volumes

</script>

<!-- HTML -->
<section>
  {#each volumes as volume}
    {#if volume.type === "slider"}
      <SliderMute
        bind:value={volume.value}
        label={volume.label}
        icon={volume.iconMic ? "mic_off" : "volume_off" }
        max={volume.max ?? 100}
        min={volume.min ?? 0}
        units={volume.units ?? "%"}
      />
    {:else if volume.type === "mute"}
      <Mute
        label={volume.label}
        icon={volume.iconMic ? "mic_off" : "volume_off" }
      />
    {/if}
  {/each}
</section>

<!-- CSS -->
<style>
  section {
    display: grid;
    gap: var(--gap);
    gap: calc(var(--gap)*2);
    width: min(80vw, 600px);
  }
</style>