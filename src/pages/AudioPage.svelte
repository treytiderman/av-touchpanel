<!-- Javascript -->
<script>

  // Stores
  import { global, router } from '../js/global.js';
  import { throttle } from '../js/helper.js';

  // Configuration
  export let config = {
    "name": "Audio",
    "file": "AudioPage",
    "simplSubscriptionID": "AudioPage",
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
  import Mute from "../components/Mute.svelte";
  import Slider from "../components/Slider.svelte";

  // Websocket
  import { ws } from '../js/simpl-ws'
  let wsSub = config.simplSubscriptionID ?? ""
  if ($global.offlineWithProcessor !== true && !$ws?.subscriptions[config.simplSubscriptionID]) {
    ws.addSubscription(wsSub)
  }

  // Websocket Feedback
  $: if ($ws.subscriptions[wsSub]?.analog) subscriptions($ws.subscriptions[wsSub])
  function subscriptions(rx) {
    volumes.forEach(volume => {
      volume.mute.state = rx.digital[volume.id]
      volume.slider.value = rx.analog[volume.id]
    })
    volumes = volumes
  }
  
  // Variables
  let volumes = config.volumes

  // Functions
  function mutePress(volume) {
    volume.mute.state = !volume.mute.state
    ws.digitalPulse(wsSub, volume.id)
    ws.serial(wsSub, volume.id, `${volume.label} mute press`)
    volumes = volumes
  }
  const sliderChange = throttle(volume => {
    ws.analog(wsSub, volume.id, volume.slider.value)
    ws.serial(wsSub, volume.id, `${volume.label} set to ${volume.slider.value}${volume.slider.units}`)
  }, 100)

  // Debug
  $: console.log("config", config)
  // $: console.log("volumes", volumes)

</script>

<!-- HTML -->
<section>
  {#each volumes as volume}
    <div class:muteOnly={!volume.slider.show}>

      <!-- Mute -->
      {#if volume.mute.show}
        <Mute
          icon={volume.mute.icon}
          muted={volume.mute.state}
          on:mute={() => mutePress(volume)}
        />
      {:else}
        <div></div>
      {/if}

      <!-- Slider -->
      {#if volume.slider.show}
        <Slider
          label={volume.label}
          max={volume.slider.max}
          min={volume.slider.min}
          units={volume.slider.units}
          disabled={volume.slider.disabled}
          bind:value={volume.slider.value}
          on:input={() => sliderChange(volume)}
        />
      {:else}
        <p>{volume.label}</p>
      {/if}

    </div>
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
  div {
    display: grid;
    gap: var(--gap);
    align-items: flex-start;
    grid-template-columns: 4rem 1fr;
  }
  div.muteOnly {
    align-items: center;
  }
</style>