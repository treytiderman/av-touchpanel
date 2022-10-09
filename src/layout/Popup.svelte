<!-- Javascript -->
<script>

  // Stores
  import { global } from "../js/global.js"
  import { fade } from 'svelte/transition';

  // Components
  import Icon from '../components/Icon.svelte'
  
  // Exports
  export let pageFiles
  export let activePopupFile
  export let activePopupConfig
  export let closeIcon = true

  // Functions
  export function close() {
    $global.router.popup = ""
  }
  function closeIfBackground(event) {
    if (event.target.localName === 'dialog') close()
  }
  function getSubpageFiles(hasSubpages, activePopupConfig) {
    if (hasSubpages) {
      let subpages = {}
      activePopupConfig.subpages.forEach(subpage => {
        let subpageFile = pageFiles[$global.config.pages[subpage]?.file] ?? pageFiles["MissingPage"]
        subpages[subpage] = subpageFile
      });
      return subpages
    }
    return false
  }

  // Variables
  let timeout
  let fadeTime = 100
  let editMode = $global.url.search.edit === "true"
  $: hasSubpages = activePopupConfig?.hasOwnProperty('subpages')
  $: activeSubpageName = hasSubpages ? activePopupConfig.subpages[0] : ""
  $: activeSubpageConfig = $global.config.pages[activeSubpageName]
  $: activeSubpageFiles = getSubpageFiles(hasSubpages, activePopupConfig)

</script>

<!-- HTML -->
<dialog 
  in:fade={{duration: fadeTime}}
  out:fade={{duration: fadeTime}}
  on:mousedown={closeIfBackground}
>
  
  <!-- Nav and Subpages -->
  {#if hasSubpages}
    <section 
      in:fade={{duration: fadeTime}}
      out:fade={{duration: fadeTime}}
      style={$$props.style}
    >

      <!-- Nav -->
      <nav>
        {#each activePopupConfig.subpages as subpage}
          <!-- on:click={() => {activeSubpageName = subpage; $global.router.subpage = subpage}} -->
          <button
            on:click={() => activeSubpageName = subpage}
            class:active={subpage === activeSubpageName}>
            {editMode ? `${$global.config.pages[subpage]?.name} [${$global.config.pages[subpage]?.file}]` : $global.config.pages[subpage]?.name}
          </button>
        {/each}
      </nav>
      {#if closeIcon}
        <button class="dialogExit" 
          on:click={close}
          on:pointerup={() => clearTimeout(timeout)}
          on:pointerdown={() => timeout = setTimeout(() => location.reload(true), 1000)}
        >
          <Icon name="close" />
        </button>
      {/if}

      <!-- Subpage -->
      <div>
        {#each activePopupConfig.subpages as subpage}
          {#await activeSubpageFiles[subpage].component() then component}
            {#if activeSubpageName === subpage}
              <svelte:component this={component.default} config={$global.config.pages[activeSubpageName]}/>
            {/if}
          {/await}
        {/each}
      </div>

    </section>

  <!-- Just Popup -->
  {:else}
    <section 
      in:fade={{duration: fadeTime}}
      out:fade={{duration: fadeTime}}
      style={$$props.style}
    >
      <h4>{editMode ? `${activePopupConfig?.name} [${activePopupConfig?.file}]` : activePopupConfig?.name}</h4>
      {#if closeIcon}
        <button class="dialogExit" 
          on:click={close}
          on:pointerup={() => clearTimeout(timeout)}
          on:pointerdown={() => timeout = setTimeout(() => location.reload(true), 1000)}
        >
          <Icon name="close" />
        </button>
      {/if}
      {#await activePopupFile.component() then component}
        <div>
          <svelte:component this={component.default} config={activePopupConfig}/>
        </div>
      {/await}
    </section>
  {/if}

  </dialog>
  
<!-- CSS -->
<style>
  dialog {
    z-index: 20;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 0;
    padding: var(--pad);
    border: 0;
    margin: auto;
    background-color: transparent;
    display: grid;
    place-items: center;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    overflow: auto;
  }
  dialog::before {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: #000000;
    opacity: 0.75;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
  section {
    position: relative;
    /* min-height: 50vh; */
    /* max-height: 90vh; */
    /* overflow: auto; */
    /* display: flex; */
    /* flex-direction: column; */
    display: grid;
    grid-template-rows: 4rem 1fr;
    align-items: flex-start;
    border-radius: var(--radius-2);
    background-color: var(--color-bg);
    border: var(--border);
    border-color: var(--color-border-bright);
  }
  div {
    padding: var(--gap);
    overflow: auto;
    width: 100%;
    height: 100%;
    max-height: 80vh;
  }
  @media (max-height: 799px) { div { max-height: 70vh; } }
  @media (max-height: 500px) { div { max-height: 60vh; } }
  h4 {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: center;
    height: 4rem;
    margin-right: 4rem;
    padding: var(--gap);
    background-color: var(--color-header);
    border-radius: calc(var(--radius-2)/1.24)  0 0 0;
    border-bottom: var(--border);
    color: var(--color-text-bright);
  }
  nav {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    min-height: 4rem;
    margin-right: 3.9rem;
    background-color: var(--color-header);
    /* padding-right: 3.8rem; */
    border-radius: calc(var(--radius-2)/1.24) 0 0 0;
    /* border-bottom: var(--border); */
    /* border-color: var(--color-header); */
  }
  button { 
    flex: 1 0 0%;
    position: relative;
    border-radius: 0;
    white-space: pre;
    color: var(--color-text-dim);
    padding: var(--gap);
    /* background-color: var(--color-bg); */
    border-bottom: var(--border);
    border-color: var(--color-header);
  }
  button.active {
    color: var(--color-text-bright);
    /* background-color: var(--color-bg); */
    border-bottom: var(--border);
    border-color: var(--color-text-dim);
    filter: brightness(100%);
  }
  .dialogExit {
    background-color: transparent;
    background-color: var(--color-header);
    color: var(--color-text);
    border: transparent;
    line-height: 1;
    margin: 0;
    
    position: absolute;
    top: -.1rem;
    top: 0;
    right: 0;
    border-radius: 0 calc(var(--radius-2)/1.24) 0 0;
    
    cursor: pointer;
    font-size: 1.6rem;
    height: 4rem;
    width: 4rem;
    padding: var(--gap);
    /* padding-bottom: calc(var(--pad)/2); */
  }
</style>
