<!-- Javascript -->
<script>

  // Stores
  import { global, router } from '../js/global.js';

  // Configuration
  export let config = {
    "name": "Video",
    "file": "VideoPage",
    "simplSubscriptionID": "VideoPage",
    "advancedOption": true,
    "advancedRouting": true,
    "inputColumns": 1,
    "outputColumns": 3,
    "inputs": [
      {
        "id": 3,
        "name": "Room PC",
        "icon": "computer"
      },
      {
        "id": 5,
        "name": "Wireless",
        "icon": "cast"
      },
      {
        "id": 1,
        "name": "Laptop Front",
        "icon": "settings_input_hdmi"
      },
      {
        "id": 2,
        "name": "Laptop Back",
        "icon": "settings_input_hdmi"
      },
      {
        "id": 4,
        "name": "Apple TV",
        "icon": "Cast"
      },
      {
        "id": 6,
        "name": "VCR",
        "icon": "settings_input_component"
      },
      {
        "id": 0,
        "name": "Blank",
        "icon": "close"
      }
    ],
    "outputs": [
      {
        "id": 1,
        "name": "Display 1"
      },
      {
        "id": 2,
        "name": "Display 2"
      },
      {
        "id": 3,
        "name": "Display 3"
      },
      {
        "id": 4,
        "name": "Display 4"
      },
      {
        "id": 5,
        "name": "Display 5"
      },
      {
        "id": 6,
        "name": "Display 6"
      },
      {
        "id": 7,
        "name": "Display 7"
      },
      {
        "id": 8,
        "name": "Display 8"
      },
      {
        "id": 9,
        "name": "Display 9"
      }
    ]
  }

  // Components
  import Icon from '../components/Icon.svelte'

  // Variables
  const iconSize = 2
  const noInput = { "id": 999, "name": "No Input", "icon": "close" }
  let advancedRouting = config.advancedRouting
  let advancedOption = config.advancedOption
  let inputs = config.inputs
  let outputs = config.outputs
  let inputHeading = config.inputHeading ?? "Select source..."
  let outputHeading = config.outputHeading ?? "Then destination..."
  let inputSelected = inputs.find(input => input.id === 0)

  // Dynamic Variables
  $: inputColumns = $global.screen.width > 550 ? config.inputColumns || "auto" : 1
  $: outputColumns = $global.screen.width > 550 ? config.outputColumns || "auto" : 1

  // Websocket
  import { ws } from '../js/simpl-ws'
  let wsSub = config.simplSubscriptionID ?? ""
  if ($global.offlineWithProcessor !== true && !$ws?.subscriptions[config.simplSubscriptionID]) {
    ws.addSubscription(wsSub)
  }

  // Websocket Feedback
  $: if ($ws.subscriptions[wsSub]?.analog) subscriptions($ws.subscriptions[wsSub])
  function subscriptions(rx) {
  
    // Set the outputs to the real feedback
    outputs.forEach(output => {
      let input = inputs.find(input => input.id === rx.analog[output.id])
      output.input = input
    })

    // Simple mode input feedback
    if (!advancedRouting && outputs.every(output => output?.input)) {
      let firstOutputsInputId = outputs[0].input.id
      let allSameInput = outputs.every(output => firstOutputsInputId === output.input.id)
      if (allSameInput) inputSelected = inputs.find(input => input.id === firstOutputsInputId)
      else inputSelected = noInput
    }

    // Advanced Routing
    else if (advancedRouting && outputs.every(output => output?.input) && inputSelected === noInput) {
      inputSelected = inputs.find(input => input.id === 0)
    }

    outputs = outputs
  }

  // Functions
  function inputSelect(input) {
    inputSelected = input
    if (advancedRouting) {
      ws.digitalPulse(wsSub, inputSelected.id)
      ws.serial(wsSub, inputSelected.id, `Input id ${inputSelected.id} "${inputSelected.name}" was pressed`)
    }
    else {
      ws.digitalPulse(wsSub, inputSelected.id)
      ws.serial(wsSub, inputSelected.id, `Input id ${inputSelected.id} "${inputSelected.name}" was pressed and routed to all displays`)
      outputs.forEach(output => {
        output.input = inputSelected
        ws.analog(wsSub, output.id, inputSelected.id)
      })
    }
  }
  function outputSelect(output) {
    output.input = inputSelected
    ws.analog(wsSub, output.id, inputSelected.id)
    ws.serial(wsSub, output.id, `Input id ${inputSelected.id} "${inputSelected.name}" was routed to Output id ${output.id} "${output.name}"`)
    outputs = outputs
  }
  function advancedToggle() {
    advancedRouting = !advancedRouting
    subscriptions($ws.subscriptions[wsSub])
  }

  // Debug
  $: console.log("config", config)
  $: console.log("inputSelected", inputSelected)
  $: console.log("advancedRouting", advancedRouting)
  $: console.log("outputs", outputs)

</script>

<!-- HTML -->
<section class:advancedSection={advancedRouting}>
  
  <!-- Inputs -->
  <div class="colunm">
    <h4>{inputHeading}</h4>
    <div
      class="inputList"
      style="grid-template-columns: repeat({inputColumns}, 1fr);"
    >
      {#each inputs as input}        
        <button 
          on:click={() => inputSelect(input)}
          class:selected={inputSelected.id === input.id}
        >
          <Icon name={input.icon} size={iconSize} />
          {input.name}
        </button>
      {/each}
    </div>
  </div>

  <!-- Outputs -->
  {#if advancedRouting}
    <div class="colunm">
      <h4>{outputHeading}</h4>
      <div 
        class="outputList"
        style="grid-template-columns: repeat({outputColumns}, 1fr);"
      >
        {#key outputs}
          {#each outputs as output}      
            <button on:click={() => outputSelect(output)} class="tv">
              <span>{output.name}</span>
              <div>
                <Icon name={output.input.icon} size={iconSize} />
                {output.input.name}
              </div>
            </button>
          {/each}
        {/key}
      </div>
    </div>
  {/if}

  <!-- Advanced Routing Toggle -->
  {#if advancedOption}
    <button class="extraButton" on:click={advancedToggle}>
      {advancedRouting ? "Simple" : "Advanced"}
      <Icon name="display_settings" size={iconSize}/>
    </button>
  {/if}
    
</section>

<!-- CSS -->
<style>
  section {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap);
    align-items: flex-start;
  }
  @media (max-width: 550px) { section { gap: var(--gap); } }
  button {
    white-space: nowrap;
    background-color: var(--color-bg-secondary);
  }
  .colunm {
    display: grid;
    gap: var(--gap);
    align-items: flex-start;
    height: 100%;
  }
  .inputList,
  .outputList {
    display: grid;
    gap: var(--gap);
    align-items: flex-start;
    overflow: auto;
    max-height: 65vh;
    padding-right: var(--gap);
  }
  /* .directionVertial {
    flex-direction: column;
  } */

  /* Inputs */
  .inputList {
    display: grid;
  }
  @media (max-width: 550px) { .inputList { max-height: 100%; } }
  .inputList > button {
    display: flex;
    gap: var(--gap);
    align-items: center;
  }
  .inputList > button.selected {
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
  }
  
  /* Outputs */
  .outputList {
    display: grid;
  }
  @media (max-width: 550px) { .outputList { max-height: 100%; } }
  .outputList > .tv {
    text-align: left;
    display: grid;
    width: 16rem;
    height: 9rem;
    aspect-ratio: 16/9;
  }
  .outputList > .tv > div {
    text-align: center;
    display: grid;
    height: 100%;
  }

  .extraButton {
    position: fixed;
    right: 0;
    bottom: 0;
    background-color: var(--color-bg);
    color: var(--color-text-dim);
    margin: var(--pad);
    padding: .5rem;

    display: flex;
    gap: var(--pad);
    align-items: center;
  }
</style>