<!-- Javascript -->
<script>

  // Stores
  import { global, router } from '../js/global.js';

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

  // Components
  import Icon from '../components/Icon.svelte'
  import CardPower from '../components/CardToggle.svelte'

  // Websocket
  import { ws } from '../js/simpl-ws'
  let wsSub = config.simplSubscriptionID ?? ""
  if ($global.offlineWithProcessor !== true && !$ws?.subscriptions[config.simplSubscriptionID]) {
    ws.addSubscription(wsSub)
  }
  
  // Websocket Feedback
  $: if ($ws.subscriptions[wsSub]?.analog) subscriptions($ws.subscriptions[wsSub])
  function subscriptions(rx) {
    devices.forEach(device => {
      device.state = rx.digital[device.id]
    })
    devices = devices
  }

  // Variables
  let devices = config.devices

  // Functions
  function onPress(device) {
    device.state = true
    ws.digital(wsSub, device.id, true)
    devices = devices
  }
  function offPress(device) {
    device.state = false
    ws.digital(wsSub, device.id, false)
    devices = devices
  }

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