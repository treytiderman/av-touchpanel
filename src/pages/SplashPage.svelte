<!-- Javascript -->
<script>

  // Stores
  import { global, router, config } from '../js/global.js';

  // Configuration
  // export let config = {
  //   "name": "Phone"
  // }

  // Functions
  export function close() {
    $router.page = homePage
  }

  let homePage = $config.topBar.homePage

</script>

<!-- HTML -->
<section on:click={close}>
  <div>
    <h1>Welcome :)</h1>
    <p>Press to begin</p>
  </div>
</section>

<!-- CSS -->
<style>
  section {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: grid;
    gap: var(--gap);
    align-items: center;
    justify-content: center;

    background-color: black;
  }
  div {
    display: grid;
    gap: var(--gap);
    text-align: center;
  }
</style>