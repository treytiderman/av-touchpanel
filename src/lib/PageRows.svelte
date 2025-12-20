<script lang="ts">
    import Slider from "./CompSlider.svelte";
    import Page from "./Page.svelte";

    const example_page: any = $state({
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
    });

    const { page = example_page } = $props();
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
                        >
                            {@html widget.text}
                        </button>
                    {:else if widget.widget_type === "spacer"}
                        <div style="flex: {widget.grow || 1} 0 0%;">&nbsp;</div>
                    {:else if widget.widget_type === "slider"}
                        <Slider
                            label={widget.text}
                            title={widget.control_id
                                ? `control_id: ${widget.control_id}`
                                : ""}
                            classList="border"
                            styleList="flex: {widget.grow || 1} 0 0%;"
                            valueChange={(value: number) => {
                                // console.log(value)
                            }}
                        />
                    {:else if widget.widget_type === "page"}
                        <Page page_id={widget.page_id} />
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>
