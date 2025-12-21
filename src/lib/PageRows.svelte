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

    let { page = $bindable(example_page) } = $props();

    for (const row of page.rows) {
        for (const widget of row.widgets) {
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
                );
                $inspect(
                    `control [${config.active.backend?.type}]:`,
                    widget.id_integer_value,
                    widget._id_integer_value.value,
                );
            }
        }
    }
</script>

<div class="grid gap-8">
    {#if page.title}
        <h2 class="flex wrap gap-2 center-y">{@html page.title}</h2>
    {/if}

    <div class="grid gap-4">
        {#each page.rows as row}
            <div class="flex wrap gap-4">
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
                            class="border flex gap-2 wrap center"
                            style="flex: {widget.grow || 1} 0 0%;"
                            onpointerdown={() =>
                                backend.setBoolean(
                                    widget.id_boolean_press,
                                    true,
                                )}
                            onpointerout={() =>
                                backend.setBoolean(
                                    widget.id_boolean_press,
                                    false,
                                )}
                            onpointerup={() =>
                                backend.setBoolean(
                                    widget.id_boolean_press,
                                    false,
                                )}
                            class:accent={widget._id_boolean_press.value}
                            class:accent-bg={widget._id_boolean_press.value}
                            class:accent-border={widget._id_boolean_press.value}
                        >
                            {@html widget.text}
                        </button>
                    {:else if widget.widget_type === "spacer"}
                        <div style="flex: {widget.grow || 1} 0 0%;">&nbsp;</div>
                    {:else if widget.widget_type === "slider"}
                        <Slider
                            min={widget.min}
                            max={widget.max}
                            units={widget.units}
                            step={widget.step}
                            label={widget.text}
                            title={widget.id_integer_value
                                ? `id_integer_value: ${widget.id_integer_value}`
                                : ""}
                            classList="border"
                            bind:value={widget._id_integer_value.value}
                            styleList="flex: {widget.grow || 1} 0 0%;"
                        />
                    {:else if widget.widget_type === "page"}
                        <Page page_id={widget.page_id} />
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>
