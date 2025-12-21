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
                        text: "Power",
                        grow: 1,
                    },
                ],
            },
            {
                widgets: [
                    {
                        control_id: "1",
                        widget_type: "button",
                        text: "On",
                        grow: 1,
                    },
                    {
                        control_id: "2",
                        widget_type: "button",
                        text: "Off",
                        grow: 1,
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
                        control_id: "3",
                        text: "Volume",
                        grow: 1,
                    },
                ],
            },
        ],
    };

    let { page = $bindable(example_page) } = $props();

    for (const row of page.rows) {
        for (const widget of row.widgets) {
            if (widget.widget_type === "text" && widget.control_id) {
                widget._control_id = backend.subscribeBoolean(
                    widget.control_id,
                );
            } else if (widget.widget_type === "button" && widget.control_id) {
                widget._control_id = backend.subscribeBoolean(
                    widget.control_id,
                );
                $inspect(
                    `control [${config.active.backend?.type}]:`,
                    widget.control_id,
                    widget._control_id.value,
                );
            } else if (widget.widget_type === "slider" && widget.control_id) {
                widget._control_id = backend.subscribeInteger(
                    widget.control_id,
                );
                $inspect(
                    `control [${config.active.backend?.type}]:`,
                    widget.control_id,
                    widget._control_id.value,
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
                            title={widget.control_id
                                ? `control_id: ${widget.control_id}`
                                : ""}
                            class="flex wrap gap-2 center-y"
                            style="flex: {widget.grow || 1} 0 0%;"
                        >
                            {@html widget.text}
                        </div>
                    {:else if widget.widget_type === "button"}
                        <button
                            title={widget.control_id
                                ? `control_id: ${widget.control_id}`
                                : ""}
                            class="border flex gap-2 wrap center"
                            style="flex: {widget.grow || 1} 0 0%;"
                            onpointerdown={() =>
                                backend.setBoolean(widget.control_id, true)}
                            onpointerout={() =>
                                backend.setBoolean(widget.control_id, false)}
                            onpointerup={() =>
                                backend.setBoolean(widget.control_id, false)}
                            class:accent={widget._control_id.value}
                            class:accent-bg={widget._control_id.value}
                            class:accent-border={widget._control_id.value}
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
                            title={widget.control_id
                                ? `control_id: ${widget.control_id}`
                                : ""}
                            classList="border"
                            bind:value={widget._control_id.value}
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
