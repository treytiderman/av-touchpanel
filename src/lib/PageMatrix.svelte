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
                name: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <line x1="22" x2="2" y1="12" y2="12" /> <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /> <line x1="6" x2="6.01" y1="16" y2="16" /> <line x1="10" x2="10.01" y1="16" y2="16" /> </svg> Room PC',
                id_boolean_press: "1",
            },
            {
                name: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M22 9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1l2 2h12l2-2h1a1 1 0 0 0 1-1Z" /> <path d="M7.5 12h9" /> </svg> Wall Plate',
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

    let { page = $bindable(example_page) } = $props();
    $inspect("matrix page", page);

    for (const input of page.inputs) {
        input._id_boolean_press = backend.subscribeBoolean(
            input.id_boolean_press,
        );
        $inspect(
            `control [${config.active.backend?.type}]:`,
            input.id_boolean_press,
            input._id_boolean_press.value,
        );
    }

    for (const output of page.outputs) {
        output._id_integer_input_fb = backend.subscribeInteger(
            output.id_integer_input_fb,
        );
        $inspect(
            `control [${config.active.backend?.type}]:`,
            output.id_integer_input_fb,
            output._id_integer_input_fb.value,
        );
    }
</script>

<div class="grid gap-8">
    {#if page.title}
        <h2 class="flex wrap gap-2 center-y">
            {@html page.title}
        </h2>
    {/if}

    <div class="flex gap-4 top wrap">
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
                        class="maxtrix-input grid center-y border"
                        class:accent={input._id_boolean_press.value}
                        class:accent-bg={input._id_boolean_press.value}
                        class:accent-border={input._id_boolean_press.value}
                        onpointerdown={() =>
                            backend.setBoolean(input.id_boolean_press, true)}
                        onpointerout={() =>
                            backend.setBoolean(input.id_boolean_press, false)}
                        onpointerup={() =>
                            backend.setBoolean(input.id_boolean_press, false)}
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
                        onpointerdown={() =>
                            backend.setBoolean(output.id_boolean_press, true)}
                        onpointerout={() =>
                            backend.setBoolean(output.id_boolean_press, false)}
                        onpointerup={() =>
                            backend.setBoolean(output.id_boolean_press, false)}
                    >
                        <div class="width-100 text-dark">
                            {@html output.name}
                        </div>
                        <div
                            class="grow width-100 grid gap-2 center"
                            style="align-content: center;"
                        >
                            {@html page.inputs[
                                output._id_integer_input_fb.value - 1
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
