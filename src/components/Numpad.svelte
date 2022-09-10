<!-- Javascript -->
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<!-- HTML -->
<div class="grid3x3">

  <button on:click={() => {dispatch('press', '1')}}>1</button>
  <button on:click={() => {dispatch('press', '2')}}>2</button>
  <button on:click={() => {dispatch('press', '3')}}>3</button>

  <button on:click={() => {dispatch('press', '4')}}>4</button>
  <button on:click={() => {dispatch('press', '5')}}>5</button>
  <button on:click={() => {dispatch('press', '6')}}>6</button>

  <button on:click={() => {dispatch('press', '7')}}>7</button>
  <button on:click={() => {dispatch('press', '8')}}>8</button>
  <button on:click={() => {dispatch('press', '9')}}>9</button>

  <button on:click={() => {dispatch('press', '*')}}>*</button>
  <button on:click={() => {dispatch('press', '0')}}>0</button>
  <button on:click={() => {dispatch('press', '#')}}>#</button>

</div>

<!-- CSS -->
<style>
  .grid3x3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap);
    /* border: var(--border); border-color: red; */
  }
  button {
    --size: 5rem;
    height: var(--size);
    width: var(--size);
    font-size: 2rem;
    padding: 0;
    position: relative;
    background-color: var(--color-bg-secondary);
    /* border: var(--border); border-color: red; */
  }
</style>