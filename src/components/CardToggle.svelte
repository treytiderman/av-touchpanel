<!-- Javascript -->
<script>
  import { global } from '../js/global.js'

  // Import Components
  import Icon from '../components/Icon.svelte'

  // Export
  export let state = false
  export let name = "Toggle"
  export let onButton = {
    icon: "circle",
    label: "ON",
    activeLabel: "ON",
    color: "green"
  }
  export let offButton = {
    icon: "square",
    label: "OFF",
    activeLabel: "OFF",
    color: "red"
  }

  // Functions
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

</script>

<!-- HTML -->
<div>
  <h6>{name}</h6>
  <span>
    <button
      on:click={() => dispatch('onPress')}
      style="
        border-color: {state ? `var(--color-bg-${onButton.color ?? "green"})` : ""};
        background-color: {state ? `var(--color-bg-${onButton.color ?? "green"})` : ""};
        color: {state ? `var(--color-text-${onButton.color ?? "green"})` : ""};
      "
    >
      <Icon name={onButton.icon ?? ""} size=2/>
      {state ? onButton.activeLabel ?? onButton.label : onButton.label ?? ""}
    </button>
    <button
      on:click={() => dispatch('offPress')}
      style="
        border-color: {!state ? `var(--color-bg-${offButton.color ?? "red"})` : ""};
        background-color: {!state ? `var(--color-bg-${offButton.color ?? "red"})` : ""};
        color: {!state ? `var(--color-text-${offButton.color ?? "red"})` : ""};
      "
    >
      <Icon name={offButton.icon ?? ""} size=2/>
      {!state ? offButton.activeLabel ?? offButton.label : offButton.label ?? ""}
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
  span > button {
    flex: 1 0 0%;
  }
  button {
    border: var(--border);
    border-color: var(--color-border-bright);
    color: var(--color-text);
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--pad);
  }
  h6 {
    font-weight: normal;
    color: var(--color-text-bright);
    white-space: pre;
  }
</style>