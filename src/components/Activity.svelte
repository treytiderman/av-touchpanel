<!-- Javascript -->
<script>
  import Icon from './Icon.svelte'

  // Exports
  export let id = 0
  export let name = "Activity"
  export let icon = "star"
  export let color = "grey"
  export let file = ""
  export let page = ""
  export let popup = ""

  // Stores
  import { global } from '../js/global.js';
  let editMode = $global.url.search.edit === "true"

</script>

<!-- HTML -->
<button
  id="activity-{id}"
  on:click
  style="
    color: var(--color-text-{color});
    background-color: var(--color-bg-{color});
  "
>
  <Icon name="{icon}" size=3.5/>
  <div> {name} {editMode ? `[${id}]` : ""} </div>
  <div hidden> {file} </div>
  <div hidden> {page} </div>
  <div hidden> {popup} </div>
</button>

<!-- CSS -->
<style>
  button {
    border-radius: var(--radius-2);
    padding: var(--padding);
    box-shadow: var(--shadow);
    
    width: 12rem;
    height: 12rem;
    font-size: 1.4rem;
  }
  /* @media (max-width: 1280px) {
    button {
      width: 14rem;
      height: 14rem;
      font-size: 1.6rem;
    }
  }
  @media (max-width: 550px) {
    button {
      margin: 0;
      width: 12rem;
      height: 12rem;
      font-size: 1.2rem;
    }
  }
  @media (max-width: 360px) {
    button {
      margin: 0;
      width: 8rem;
      height: 8rem;
      font-size: .9rem;
    }
  } */
</style>