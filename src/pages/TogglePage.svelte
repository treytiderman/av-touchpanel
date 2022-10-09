<!-- Javascript -->
<script>

  // Imports
  import { global } from '../js/global.js';
  import { ws } from '../js/simpl-ws'

  // Import Components
  import Icon from '../components/Icon.svelte'
  import Loading from '../components/Loading.svelte'
  import CardPower from '../components/CardToggle.svelte'

  // Configuration
  export let config = {
    "name": "Device Power",
    "file": "TogglePage",
    "cardWidth": "500px",
    "toggles": [
      {
        "id": 1,
        "name": "Display",
      },
      {
        "id": 2,
        "name": "Audio Recorder",
        "state": false,
        "onButton": {
          "icon": "circle",
          "label": "Record",
          "activeLabel": "Recording",
          "color": "red"
        },
        "offButton": {
          "icon": "square",
          "label": "Stop",
          "activeLabel": "Stopped",
          "color": "grey"
        }
      }
    ]
  }

  // Variables
  let editMode = $global.url.search.edit === "true"
  let cardWidth = config.cardWidth
  let toggles = config.toggles

  // Functions
  function onPress(device) {
    device.state = true
    ws.debug(`Device id ${device.id} "${device.name}" was powered ON`)
    ws.digitalPulse(wsSub, device.id*2-1)
    toggles = toggles
  }
  function offPress(device) {
    device.state = false
    ws.debug(`Device id ${device.id} "${device.name}" was powered OFF`)
    ws.digitalPulse(wsSub, device.id*2)
    toggles = toggles
  }

  // Websocket - SIMPL Feedback
  let wsSub = config.simplSubscriptionID ?? config.file
  ws.addSubscription(wsSub, rx => {
    toggles.forEach(toggle => {
      toggle.state = rx.digital[toggle.id]
    })
    toggles = toggles
  })

  // Debug
  $: console.log("DevicePowerPage config", config)

</script>

<!-- HTML -->
<Loading show={!$ws.subscriptions[wsSub]?.ready && $global.config?.server?.online}/>
<section style="grid-template-columns: repeat(auto-fit, minmax(min({cardWidth ?? "200px"}, 100%), .4fr));">
  {#each toggles as toggle}
    <CardPower
      state={toggle.state}
      name={editMode ? `${toggle.name} [${toggle.id}]` : toggle.name}
      onButton={toggle.onButton ?? {icon: "", label: "ON", activeLabel: "ON", color: "green"}}
      offButton={toggle.offButton ?? {icon: "", label: "OFF", activeLabel: "OFF", color: "red"}}
      on:onPress={() => onPress(toggle)}
      on:offPress={() => offPress(toggle)}
    />
  {/each}
</section>

<!-- CSS -->
<style>
  section {
    width: 70%;
    display: grid;
    gap: var(--gap);
    justify-content: center;
  }
  @media (max-width: 550px) {section {width: 100%}}
</style>