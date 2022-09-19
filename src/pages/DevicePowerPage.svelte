<!-- Javascript -->
<script>

  // Imports
  import { global, router } from '../js/global.js';
  import { ws } from '../js/simpl-ws'

  // Import Components
  import Icon from '../components/Icon.svelte'
  import CardPower from '../components/CardToggle.svelte'

  // Configuration
  export let config = {
    "name": "Device Power",
    "file": "DevicePowerPage",
    "simplSubscriptionID": "DevicePowerPage",
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

  // Variables
  let editMode = $global.url.search.edit === "true"
  let devices = config.devices

  // Functions
  function onPress(device) {
    device.state = true
    ws.serial(wsSub, 1, `Device id ${device.id} "${device.name}" was powered ON`)
    ws.digitalPulse(wsSub, device.id*2-1)
    devices = devices
  }
  function offPress(device) {
    device.state = false
    ws.serial(wsSub, 1, `Device id ${device.id} "${device.name}" was powered OFF`)
    ws.digitalPulse(wsSub, device.id*2)
    devices = devices
  }

  // Websocket - SIMPL Feedback
  let wsSub = config.simplSubscriptionID ?? config.file
  ws.addSubscription(wsSub, () => {
    devices.forEach(device => {
      device.state = rx.digital[device.id]
    })
    devices = devices
  })

  // Debug
  $: console.log("DevicePowerPage config", config)

</script>

<!-- HTML -->
<section>
  {#each devices as device}
    <CardPower
      state={device.state}
      label={editMode ? `${device.name} [${device.id}]` : device.name}
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