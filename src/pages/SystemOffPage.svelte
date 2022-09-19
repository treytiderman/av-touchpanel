<!-- Javascript -->
<script>

  // Stores
  import { global, router, config as configFile } from '../js/global.js';

  // Configuration
  export let config = {
    "name": "System Off",
    "file": "SystemOffPage",
    "simplSubscriptionID": "SystemOffPage",
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

  // Websocket
  import { ws } from '../js/simpl-ws'
  let wsSub = config.simplSubscriptionID ?? "TouchPanel"
  ws.addSubscription(wsSub)

  // Functions
  export function powerOff() {
    ws.serial(wsSub, 1, `System Off was pressed`)
    ws.digitalPulse(wsSub, 1)
    $router.page = offPage
    $router.popup = ""
    // location.reload()
  }
  export function close() {
    $router.popup = ""
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