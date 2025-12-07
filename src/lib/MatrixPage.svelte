<script lang="ts">
    import { config } from "../js/config.svelte";

    const index = 0;
    console.log("config.active.page_list[index].inputs", config.active.page_list[index].inputs);
</script>

<div class="grid gap-8">
    {#if config.active.page_list[index].title}
        <h2 class="flex wrap gap-2 center-y">{@html config.active.page_list[index].title}</h2>
    {/if}

    <div class="flex gap-8 top">
        <div class="grid gap-2">
            <div title={JSON.stringify(config.active.page_list[index].inputs, null, 4)}>
                {config.active.page_list[index].input_title || "Select Source"}
            </div>
            <div
                class="grid gap-4"
                style="grid-template-columns: repeat({config.active.page_list[index].input_columns}, 1fr);"
            >
                {#each config.active.page_list[index].inputs as input}
                    <button
                        class="maxtrix-input grid center-y border"
                        class:selected={input._selected}
                        onclick={() => {
                            config.active.page_list[index].inputs.forEach((input: { _selected: boolean }) => {
                                input._selected = false;
                            });
                            input._selected = true;
                        }}
                    >
                        <div class="flex gap-4 center-y">{@html input.name}</div>
                    </button>
                {/each}
            </div>
        </div>
        <div class="grid gap-2">
            <div title={JSON.stringify(config.active.page_list[index].outputs, null, 4)}>{config.active.page_list[index].output_title || "Then Destination"}</div>
            <div
                class="grid gap-4"
                style="grid-template-columns: repeat({config.active.page_list[index].output_columns}, 1fr);"
            >
                {#each config.active.page_list[index].outputs as output}
                    <button
                        class="maxtrix-output flex column top border pad-2"
                        onclick={() => {
                            output._input_name = config.active.page_list[index].inputs.find(
                                (input: { _selected: any }) => input._selected,
                            ).name;
                        }}
                    >
                        <div class="width-100 text-dark">{@html output.name}</div>
                        <div class="grow width-100 grid gap-2 center" style="align-content: center;">
                            {@html output._input_name}
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .selected {
        color: var(--accent);
        border-color: var(--accent-border);
        background-color: var(--accent-bg);
    }

    .maxtrix-input,
    .maxtrix-output {
        width: 14em;
        text-align: left;
    }

    :global(.maxtrix-input svg),
    :global(.maxtrix-output svg) {
        width: 1.5em;
        height: 1.5em;
        min-width: 1.5em;
    }

    .maxtrix-input {
        height: 2.75em;
    }

    .maxtrix-output {
        aspect-ratio: 16/9;
    }
</style>
