<!-- Javascript -->
<script>

  // Stores
  import { global, router, config as configFile } from '../js/global.js';

  // Configuration
  export let config = {
    "name": "Splash",
    "file": "SplashPage",
    "png": "images/FordAV_BlackBG_1920_1080.png",
    "backgroundColor": "#000000"
  }

  // Functions
  export function close() {
    $router.page = homePage
  }

  let homePage = $configFile.topBar.homePage

</script>

<!-- HTML -->
<section on:click={close} class="fixed" style="background-color: {config.backgroundColor};">
  <img src="./{config.image}" alt="Splash Page Logo">
  <div>
    <h1>Welcome :)</h1>
    <p>Press to begin</p>
  </div>
</section>

<!-- CSS -->
<style>
  .fixed {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  section {
    display: grid;
    gap: var(--gap);
    align-items: center;
    justify-content: center;
    /* background-color: gray; */
  }
  div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    display: none;
    flex-direction: column;
    gap: var(--gap);
    align-items: center;
    /* justify-content: center; */
    text-align: center;
    padding-top: 40vh;
    /* background-color: red; */
  }
  img {
    max-width: 100%;
    display: block;
  }
</style>