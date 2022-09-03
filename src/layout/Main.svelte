<!-- Javascript -->
<script>

  // Stores
  import { router, config } from "../js/global.js";
  
  // Exports
  export let pageFiles
  export let activePageFile
  export let activePageConfig
  
  // Function
  function getSubpageFiles(hasSubpages) {
    if (hasSubpages) {
      let subpages = {}
      activePageConfig.subpages.forEach(subpage => {
        let subpageFile = pageFiles[$config.pages[subpage]?.file] || pageFiles["MissingPage"]
        subpages[subpage] = subpageFile
      });
      return subpages
    }
    return false
  }

  // Dynamic Variables
  $: hasSubpages = activePageConfig.hasOwnProperty('subpages')
  $: activeSubpageName = hasSubpages ? activePageConfig.subpages[0] : ""
  $: activeSubpageFiles = getSubpageFiles(hasSubpages)

  // Get all the file names
  $config.files = []
  $config.pages["AllPages"] = {name: "All Pages", file: "AllPages"}
  $config.pageFiles = pageFiles

</script>

<!-- HTML -->
{#if hasSubpages}

  <!-- Nav and Subpages -->
  <nav>
    {#each activePageConfig.subpages as subpage}
      <button
        on:click={() => activeSubpageName = subpage}
        class:active={subpage === activeSubpageName}
      >
        {$config.pages[subpage]?.name}
      </button>
    {/each}
  </nav>
  {#each activePageConfig.subpages as subpage}
    {#await activeSubpageFiles[subpage].component() then component}
      {#if activeSubpageName === subpage}        
        <main>
          <svelte:component this={component.default} config={$config.pages[subpage]}/>
        </main>
      {/if}
    {/await}
  {/each}

{:else}

  <!-- Just Page -->
  {#await activePageFile.component() then component}
    <main>
      <svelte:component this={component.default} config={activePageConfig}/>
    </main>
  {/await}

{/if}

<!-- CSS -->
<style>
  nav {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    min-height: 4rem;
    background-color: var(--color-header);
  }
  button { 
    flex: 1 0 0%;
    position: relative;
    border-radius: 0;
    white-space: pre;
    color: var(--color-text-dim);
    border-bottom: var(--border);
    border-color: var(--color-header);
  }
  button.active {
    color: var(--color-text-bright);
    border-bottom: var(--border);
    border-color: var(--color-text-dim);
    filter: brightness(100%);
  }
  :global(body) {
    display: flex;
    flex-direction: column;
  }
  :global(main) {
    flex-grow: 1;
    overflow: auto;
    padding: var(--gap);
    display: flex;
  }
  :global(main > *) {
    margin: auto;
  }
</style>