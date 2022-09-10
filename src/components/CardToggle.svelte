<!-- Javascript -->
<script>

  // Export
  export let label = "Toggle"
  export let labelOn = "ON"
  export let labelOff = "OFF"
  export let state = false

  // Functions
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

</script>

<!-- HTML -->
<div>
  <h6>{label}</h6>
  <span>
    <button
      class:on={state}
      on:click={() => dispatch('onPress')}
    >
      {labelOn}
    </button>
    <button
      class:off={!state}
      on:click={() => dispatch('offPress')}
    >
      {labelOff}
    </button>
  </span>
</div>

<!-- CSS -->
<style>
  div {
    background-color: var(--color-header);
    border-radius: var(--radius-2);
    padding: var(--gap);
    display: flex;
    flex-direction: column;
    gap: var(--gap);
  }
  span {
    display: flex;
    gap: var(--gap);
    flex-wrap: wrap;
    margin-top: auto;
  }
  button {
    border: var(--border);
    border-color: var(--color-border-bright);
  }
  h6 {
    font-weight: normal;
    color: var(--color-text-bright);
    white-space: pre;
  }
  .on {
    border-color: var(--color-bg-green);
    background-color: var(--color-bg-green);
    color: var(--color-text-green);
  }
  .off {
    border-color: var(--color-bg-red);
    background-color: var(--color-bg-red);
    color: var(--color-text-red);
  }
</style>