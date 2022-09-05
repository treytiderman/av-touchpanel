<!-- Javascript -->
<script>

  // Stores
  import { global, router } from '../js/global.js';
  import { ws } from '../js/simpl-ws'

  // Configuration
  export let config = {
    "name": "Device Power",
    "file": "DevicePowerPage",
    "SIMPL": {
      "subscription": "DevicePowerPage"
    },
    "devices": [
      {
        "id": 1,
        "name": "Display Left"
      },
      {
        "id": 2,
        "name": "Display Right"
      },
      {
        "id": 3,
        "name": "Projector"
      }
    ]
  }

  // Imports Components
  import Icon from '../components/Icon.svelte'
  import CardPower from '../components/CardToggle.svelte'

  // Variables
  let devices = config.devices
  let sub = config.SIMPL.subscription

  // Functions
  function wsRX(rx) {
    devices.forEach(device => {
      device.state = rx.digital[device.id]
    })
  }
  function onPress(device) {
    device.state = true
    ws.digital(sub, device.id, true)
    devices = devices
  }
  function offPress(device) {
    device.state = false
    ws.digital(sub, device.id, false)
    devices = devices
  }
  $: $ws?.DevicePowerPage ? wsRX($ws.DevicePowerPage) : ""

  // Debug
  $: console.log("devices", devices)

</script>

<!-- HTML -->
<section>
  {#each devices as device}
    <CardPower
      state={device.state}
      label={device.name}
      on:onPress={() => onPress(device)}
      on:offPress={() => offPress(device)}
    />
  {/each}
</section>

<!-- CSS -->
<style>
  section {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap);
    justify-content: center;
  }
</style>