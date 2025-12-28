<script lang="ts">
    import { config } from "../js/config.svelte";
    import { backend } from "../js/backend.svelte";

    const example_page: any = {
        page_id: "matrix",
        page_type: "matrix",
        title: "Matrix",
        input_title: "Route Source",
        output_title: "To Destination",
        input_columns: 1,
        output_columns: 2,
        inputs: [
            {
                name: "Room PC",
                id_boolean_press: "1",
            },
            {
                name: "Wall Plate",
                id_boolean_press: "2",
            },
        ],
        outputs: [
            {
                name: "Display Left + Audio",
                id_boolean_press: "11",
            },
            {
                name: "Display Right",
                id_boolean_press: "12",
            },
        ],
    };

    let { page = example_page, page_index = 0 } = $props();

    // Backend subscriptions
    $effect(() => {
        for (const [input_index, input] of page.inputs.entries()) {
            input._path = `#/page_list/${page_index}/inputs/${input_index}/name`;
            input._id_boolean_press = backend.subscribeBoolean(
                input.id_boolean_press,
            );
            $inspect(
                `control [${config.active.backend?.type}]:`,
                input.id_boolean_press,
                input._id_boolean_press.value,
            );
        }
        for (const [output_index, output] of page.outputs.entries()) {
            output._path = `#/page_list/${page_index}/outputs/${output_index}/name`;
            output._id_integer_input_fb = backend.subscribeInteger(
                output.id_integer_input_fb,
            );
            $inspect(
                `control [${config.active.backend?.type}]:`,
                output.id_integer_input_fb,
                output._id_integer_input_fb.value,
            );
        }
    });
</script>

<div class="grid gap-8">
    {#if page.title}
        <h2 class="flex wrap gap-2 center-y">
            {@html page.title}
        </h2>
    {/if}

    <div class="flex gap-4 top wrap" style="row-gap: calc(var(--gap)*8);">
        <div class="grid gap-2">
            <div class="flex center-y gap-2">
                {@html page.input_title || "Select Source"}
            </div>
            <div
                class="grid gap-4"
                style="grid-template-columns: repeat({page.input_columns}, 1fr);"
            >
                {#each page.inputs as input}
                    <button
                        title={input.id_boolean_press
                            ? `id_boolean_press: ${input.id_boolean_press}`
                            : ""}
                        class="maxtrix-input grid center-y border {page.input_active_color}"
                        class:accent={input._id_boolean_press?.value}
                        onclick={() => {
                            backend.pulseBoolean(input.id_boolean_press)
                            config.focus_path = input._path
                        }}
                    >
                        <div class="flex gap-4 center-y">
                            {@html input.name}
                        </div>
                    </button>
                {/each}
            </div>
        </div>
        <div class="grid gap-2">
            <div class="flex center-y gap-2">
                {@html page.output_title || "Then Destination"}
            </div>
            <div
                class="grid gap-4"
                style="grid-template-columns: repeat({page.output_columns}, 1fr);"
            >
                {#each page.outputs as output}
                    <button
                        title={output.id_boolean_press
                            ? `id_boolean_press: ${output.id_boolean_press}`
                            : "" + output.id_integer_input_fb
                              ? `id_integer_input_fb: ${output.id_integer_input_fb}`
                              : ""}
                        class="maxtrix-output flex column top border pad-2"
                        onclick={() => {
                            backend.pulseBoolean(output.id_boolean_press)
                            config.focus_path = output._path
                        }}
                    >
                        <div class="width-100 text-dark">
                            {@html output.name}
                        </div>
                        <div
                            class="grow width-100 grid gap-2 center"
                            style="align-content: center;"
                        >
                            {@html page.inputs[
                                output._id_integer_input_fb?.value - 1
                            ]?.name || ""}
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
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
