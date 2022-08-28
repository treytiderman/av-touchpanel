<!-- Javascript -->
<script>
  // Imports
  import Icon from "./Icon.svelte";

  // Export
  export let label = ""
  export let muted = false
  export let icon = "mic_off"

  // Functions
  function mute() {
    muted = !muted
  }
</script>

<!-- HTML -->
<div>
  <button class:muted={muted} on:click={mute}>
    <Icon name={icon}/>
  </button>
  <p>
    {label}
  </p>
</div>

<!-- CSS -->
<style>
  div {
    display: grid;
    gap: var(--gap);
    align-items: center;
    grid-template-columns: 4rem 1fr;
  }
  button {
    font-size: 1.6rem;
    color: var(--color-text-dim);
    border: var(--border);
    border-color: var(--color-bg-secondary);
    width: 4rem;
    height: 4rem;
    padding: 0;
    border-radius: 99px;
    -webkit-tap-highlight-color: transparent;
  }
  .muted {
    border: var(--border);
    border-color: var(--color-bg-red);
    background-color: var(--color-bg-red);
    color: var(--color-text-red);
  }
  /* div { border: 1px solid red; } */
</style>