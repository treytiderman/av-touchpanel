<script lang="ts">
    import { config } from "../js/config.svelte";
    import { backend } from "../js/backend.svelte";

    import Slider from "./CompSlider.svelte";
    import Page from "./Page.svelte";

    const example_page: any = {
        title: "System",
        page_id: "rows",
        page_type: "rows",
        rows: [
            {
                widgets: [
                    {
                        widget_type: "text",
                        grow: 1,
                        text: "Power",
                    },
                ],
            },
            {
                widgets: [
                    {
                        widget_type: "button",
                        grow: 1,
                        text: "On",
                        id_boolean_press: "1",
                    },
                    {
                        widget_type: "button",
                        grow: 1,
                        text: "Off",
                        id_boolean_press: "2",
                    },
                    {
                        widget_type: "spacer",
                        grow: 1,
                    },
                    {
                        widget_type: "spacer",
                        grow: 1,
                    },
                ],
            },
            {
                widgets: [
                    {
                        widget_type: "spacer",
                        grow: 1,
                    },
                ],
            },
            {
                widgets: [
                    {
                        widget_type: "slider",
                        grow: 1,
                        text: "Volume",
                        id_integer_value: "1",
                    },
                ],
            },
        ],
    };

    let { page = example_page, page_index = 0 } = $props();

    $effect(() => {
        for (const [row_index, row] of page.rows.entries()) {
            for (const [widget_index, widget] of row.widgets.entries()) {
                widget._path = `#/page_list/${page_index}/rows/${row_index}/widgets/${widget_index}/widget_type`;

                if (widget.widget_type === "text" && widget.id_boolean_hide) {
                    widget._id_boolean_hide = backend.subscribeBoolean(
                        widget.id_boolean_hide,
                    );
                } else if (
                    widget.widget_type === "button" &&
                    widget.id_boolean_press
                ) {
                    widget._id_boolean_press = backend.subscribeBoolean(
                        widget.id_boolean_press,
                    );
                    $inspect(
                        `control [${config.active.backend?.type}]:`,
                        widget.id_boolean_press,
                        widget._id_boolean_press.value,
                    );
                } else if (
                    widget.widget_type === "slider" &&
                    widget.id_integer_value
                ) {
                    widget._id_integer_value = backend.subscribeInteger(
                        widget.id_integer_value,
                    ) || { value: -1 };
                    $inspect(
                        `control [${config.active.backend?.type}]:`,
                        widget.id_integer_value,
                        widget._id_integer_value.value,
                        widget._id_integer_value.value_signed,
                    );
                }
            }
        }
    });
</script>

<div class="grid gap-8">
    {#if page.title}
        <h2 class="flex wrap gap-2 center-y">{@html page.title}</h2>
    {/if}

    <div class="grid gap-4">
        {#each page.rows as row}
            <div class="flex center-y wrap gap-4">
                {#each row.widgets as widget}
                    {#if widget.widget_type === "text"}
                        <div
                            title={widget.id_boolean_hide
                                ? `id_boolean_hide: ${widget.id_boolean_hide}`
                                : ""}
                            class="flex wrap gap-2 center-y"
                            style="flex: {widget.grow || 1} 0 0%;"
                        >
                            {@html widget.text}
                        </div>
                    {:else if widget.widget_type === "button"}
                        <button
                            title={widget.id_boolean_press
                                ? `id_boolean_press: ${widget.id_boolean_press}`
                                : ""}
                            class="row-button border flex gap-2 wrap center {widget.active_color}"
                            style="flex: {widget.grow || 1} 0 0%;"
                            onclick={() => {
                                backend.pulseBoolean(widget.id_boolean_press);
                                config.focus_path = widget._path;
                            }}
                            class:accent={widget._id_boolean_press?.value}
                        >
                            {@html widget.text}
                        </button>
                    {:else if widget.widget_type === "spacer"}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div
                            style="flex: {widget.grow || 1} 0 0%;"
                            title={widget._path}
                            onclick={() => (config.focus_path = widget._path)}
                        >
                            &nbsp;
                        </div>
                    {:else if widget.widget_type === "slider"}
                        {#if widget._id_integer_value && widget.signed === "true"}
                            <Slider
                                min={widget.min}
                                max={widget.max}
                                units={widget.units}
                                step={widget.step}
                                label={widget.text}
                                title={widget.id_integer_value
                                    ? `id_integer_value: ${widget.id_integer_value}`
                                    : ""}
                                classList="border {widget.active_color}"
                                styleList="flex: {widget.grow || 1} 0 0%;"
                                bind:value={
                                    widget._id_integer_value.value_signed
                                }
                                onclick={() =>
                                    (config.focus_path = widget._path)}
                            />
                        {:else if widget._id_integer_value}
                            <Slider
                                min={widget.min}
                                max={widget.max}
                                units={widget.units}
                                step={widget.step}
                                label={widget.text}
                                title={widget.id_integer_value
                                    ? `id_integer_value: ${widget.id_integer_value}`
                                    : ""}
                                classList="border {widget.active_color}"
                                styleList="flex: {widget.grow || 1} 0 0%;"
                                {@attach (element: any) => {
                                    // convert unsigned to signed
                                    if (widget.signed === "true") {
                                        element.value = widget._id_integer_value.value - widget.min;
                                    }
                                }}
                                bind:value={widget._id_integer_value.value}
                                onclick={() =>
                                    (config.focus_path = widget._path)}
                            />
                        {/if}
                    {:else if widget.widget_type === "page"}
                        <Page page_id={widget.page_id} />
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    :global(.row-button svg) {
        width: 1.5em;
        height: 1.5em;
        min-width: 1.5em;
    }

    .row-button {
        height: 3em;
    }
</style>
