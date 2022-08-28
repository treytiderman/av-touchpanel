<!-- Javascript -->
<script>

  // Stores
  import { global, router } from '../js/global.js';

  // Configuration
  export let config 
  const exampleConfig = {
    "name": "Presentation",
    "advanced": false,
    "inputSelected": 0,
    "inputs": [
      {
        "id": 1,
        "name": "Laptop Front",
        "icon": "computer"
      },
      {
        "id": 2,
        "name": "Laptop Back",
        "icon": "laptop_windows"
      },
      {
        "id": 3,
        "name": "Old DVD Player",
        "icon": "settings_input_component"
      },
      {
        "id": 4,
        "name": "HDMI Input",
        "icon": "settings_input_hdmi"
      },
      {
        "id": 0,
        "name": "Blank",
        "icon": "close"
      }
    ],
    "outputs": [
      {
        "id": 0,
        "name": "Display Left",
        "inputId": 0
      },
      {
        "id": 1,
        "name": "Display Right",
        "inputId": 0
      },
      {
        "id": 2,
        "name": "Projector",
        "inputId": 0
      }
    ]
  }

  // Components
  import Icon from '../components/Icon.svelte'

  // Variables
  let advanced = config.advanced
  let inputs = config.inputs
  let outputs = config.outputs
  let inputSelected = config.inputSelected

</script>

<!-- HTML -->
<!-- Advanced Routing -->
{#if advanced}
  <section class="advancedSection">

    <!-- Inputs -->
    <div class="colunm">
      <h4>Select source...</h4>
      <div class="sources">
        {#each inputs as input}        
          <button 
            class:selected={inputSelected === input.id}
            on:click={() => inputSelected = input.id}
          >
            <Icon name={input.icon} style="font-size: 2rem" />
            {input.name}
          </button>
        {/each}
      </div>
    </div>

    <!-- Outputs -->
    <div class="colunm">
      <h4>Then destination...</h4>
      <div 
        class="tvs"
        style="grid-template-columns: { outputs.length > 1 ? "1fr" : "1fr" };"
      >
        {#each outputs as output}        
          <button on:click={() => output.inputId = inputSelected} class="tv">
            <span>{output.name}</span>
            <div>
              <Icon name={inputs.find(input => input.id === output.inputId).icon} style="font-size: 2rem" />
              {inputs.find(input => input.id === output.inputId).name}
            </div>
          </button>
        {/each}
      </div>
    </div>

    <button class="lowerLeft"
      on:click={() => advanced = !advanced}
    >
      <Icon name="display_settings" size=2/>
      Simple
    </button>
  </section>

<!-- Simple Routing -->
{:else}
  <section class="simpleSection">

    <!-- Inputs -->
    <div class="colunm">
      <h4>Select source...</h4>
      <div class="sources">
        {#each inputs as input}        
          <button 
            class:selected={inputSelected === input.id}
            on:click={() => inputSelected = input.id}
          >
            <Icon name={input.icon} style="font-size: 2rem" />
            {input.name}
          </button>
        {/each}
      </div>
    </div>

    <button class="lowerLeft"
      on:click={() => advanced = !advanced}
    >
      <Icon name="display_settings" size=2/>
      Advanced
    </button>

  </section>
{/if}



<!-- CSS -->
<style>
  section {
    display: grid;
    gap: calc(var(--gap)*2);
    align-items: flex-start;
    /* border: var(--border); border-color: red; */
    /* padding: var(--gap); */
    /* background-color: var(--color-header); */
    /* border-radius: var(--radius-2); */
  }
  .simpleSection {
    grid-template-columns: 1fr;
  }
  .advancedSection {
    grid-template-columns: auto 1fr;
  }
  .colunm {
    display: grid;
    gap: var(--gap);
    align-items: flex-start;
  }
  button {
    position: relative;
    overflow-wrap: break-word;
    background-color: var(--color-bg-secondary);
    min-width: 10rem;
  }
  .sources {
    display: grid;
    gap: var(--gap);
    grid-template-columns: 1fr 1fr;
    
    /* border: var(--border); border-color: red; */
  }
  .sources > button {
    display: flex;
    gap: var(--gap);
    align-items: center;
  }
  .sources > button.selected {
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
  }
  
  .tvs {
    display: grid;
    gap: var(--gap);
    align-items: flex-start;
    grid-template-columns: 1fr 1fr;
    /* border: var(--border); border-color: red; */
  }
  .tvs > .tv {
    text-align: left;
    display: grid;
    width: 16rem;
    height: 9rem;
    aspect-ratio: 16/9;
  }
  .tvs > .tv > div {
    text-align: center;
    display: grid;
    height: 100%;
    /* color: var(--color-font-2); */
  }

  .lowerLeft {
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: var(--color-bg);
    color: var(--color-text-dim);
    margin: var(--pad);
    padding: .5rem;

    display: flex;
    gap: var(--pad);
    align-items: center;
  }
  /* @media (max-width: 550px) { .sources { grid-template-columns: 1fr } } */
  @media (max-width: 1000px) { .tvs { grid-template-columns: 1fr } }
  @media (max-width: 760px) { .advancedSection { grid-template-columns: 1fr } }
</style>