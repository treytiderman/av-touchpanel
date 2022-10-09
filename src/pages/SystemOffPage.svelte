<!-- Javascript -->
<script>

  // Stores
  import { global } from '../js/global.js';

  // Configuration
  export let config = {
    "name": "System Off",
    "file": "SystemOffPage",
    "offList": [
      "Power down all Displays & Projectors",
      "Mute the Microphones and Speakers",
      "Lock out the Touch Panel"
    ],
    "offTimer_sec": 30,
    "offPage": "home"
  }

  // Variables
  let offPage = config.offPage
  let offTimer_sec = config.offTimer_sec
  let offList = config.offList
  let tpId = $global.config?.client?.id

  // Websocket
  import { ws } from '../js/simpl-ws'
  let wsSub = config.simplSubscriptionID ?? "TouchPanel"
  ws.addSubscription(wsSub, () => {})

  // Functions
  export function powerOff() {
    ws.serial(wsSub, tpId, `System Off was pressed on touch panel id ${tpId}`)
    ws.digitalPulse(wsSub, tpId)
    $global.router.page = offPage
    $global.router.popup = ""
    // location.reload(true)
  }
  export function close() {
    $global.router.popup = ""
  }

</script>

<!-- HTML -->
<section>
  <ol style="margin-right: var(--gap);">
    {#each offList as listItem}
      <li>{listItem}</li>
    {/each}
  </ol>
  <div>
    <button class="confirm" on:click={powerOff}>Confirm</button>
    <button class="cancel"  on:click={close}>Cancel</button>
  </div>
</section>

<!-- CSS -->
<style>
  section {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    height: 100%;
  }
  div {
    display: flex;
    align-items: flex-end;
    gap: var(--gap);
    height: 100%;
  }
  .confirm {
    background-color: var(--color-bg-red);
    color: var(--color-text-red);
  }
  .cancel {
    margin-left: auto;
    color: var(--color-bg-secondary);
  }
</style>