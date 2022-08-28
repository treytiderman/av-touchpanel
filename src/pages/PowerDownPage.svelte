<!-- Javascript -->
<script>

  // Stores
  import { global, router } from '../js/global.js';

  // Configuration
  export let config
  const exampleConfig = {
    "name": "System Off",
    "file": "PowerDownPage",
    "SIMPL": {
      "ip": "192.168.1.69",
      "port": 10000,
      "path": "AudioPage"
    }
  }

  // Functions
  export function powerOff() {
    $router.page = config.offPage
    $router.popup = ""
  }
  export function close() {
    $router.popup = ""
  }

</script>

<!-- HTML -->
<section>
  <ol style="margin-right: var(--gap);">
    <li>Power down all Displays & Projectors</li>
    <li>Mute the Microphones and Speakers</li>
    <li>Lock out the Touch Panel</li>
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