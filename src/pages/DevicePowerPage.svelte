<!-- Javascript -->
<script>

  // Stores
  import { global, router, config } from '../js/global.js';

  // Configuration
  // export let config = {
  //   "name": "Phone"
  // }

  // Imports Components
  import Icon from '../components/Icon.svelte'
  import CardPower from '../components/CardToggle.svelte'

</script>

<!-- HTML -->
<section>
  <CardPower
    label="Theme"
    labelOn="Light"
    labelOff="Dark"
    on={$config.theme === 'light'}
    on:onPress={ () => $config.theme = 'light' }
    on:offPress={ () => $config.theme = 'dark' }
  />
  <CardPower label="Display Left"/>
  <CardPower label="Display Right"/>
  <CardPower label="Projector"/>
  <button
    class="lowerLeft"
    on:click={() => location.reload()}
  >
    <Icon name="refresh" size=2/>
    Reload
  </button>
</section>

<!-- CSS -->
<style>
  section {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap);
    justify-content: center;
  }
  .lowerLeft {
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: var(--color-bg);
    opacity: 75%;
    color: var(--color-text-dim);
    margin: var(--pad);
    padding: .5rem;

    display: flex;
    gap: var(--pad);
    align-items: center;
  }
</style>