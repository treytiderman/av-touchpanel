<!-- Javascript -->
<script>
  import Icon from './Icon.svelte'
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let presets = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
    { id: 6, name: "6" },
  ]
  let timeout
  export let savePresetHoldTime_sec = 2
  export let saved = false
  export let selected = 0
</script>

<!-- HTML -->
<div class="grid3x3">

  {#each presets as preset}
    <button
      class:selected={selected === preset.id}
      on:pointerup={ () => {
        clearTimeout(timeout)
        if (!saved) {
          dispatch('recall', preset.id)
          selected = preset.id
        }
      }}
      on:pointerdown={ () => {
        saved = false
        timeout = setTimeout(() => {
          dispatch('save', preset.id)
          saved = true
        }, savePresetHoldTime_sec * 1000)
      }}
    >
      {preset.name}
    </button>
  {/each}

</div>

<!-- CSS -->
<style>
  .grid3x3 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap);
    justify-items: flex-start;
    /* border: var(--border); border-color: red; */
  }
  button {
    --size: 4rem;
    height: var(--size);
    width: var(--size);
    background-color: var(--color-bg-secondary);
    font-size: 1.4em;
    /* border: var(--border); border-color: red; */
  }
  .selected {
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
  }
</style>