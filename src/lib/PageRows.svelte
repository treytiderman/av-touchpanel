<script lang="ts">
    import Slider from "./CompSlider.svelte";
    import Page from "./Page.svelte";

    const example_page: any = {
        title: 'System <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--error)"     stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"     class="lucide lucide-heart-icon lucide-heart">     <path         d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /> </svg>',
        page_id: "rows",
        page_type: "rows",
        rows: [
            {
                widgets: [
                    {
                        widget_type: "text",
                        text: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-power-icon lucide-power"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg> Power',
                        grow: 1,
                    },
                ],
            },
            {
                widgets: [
                    {
                        id: "1",
                        widget_type: "button",
                        text: "On",
                        grow: 1,
                    },
                    {
                        id: "2",
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
                        id: "3",
                        text: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume2-icon lucide-volume-2"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg> Volume',
                        grow: 1,
                    },
                ],
            },
        ],
    };

    const { page = example_page } = $props();

    // console.log("example_page.rows", page.rows);
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
                            class="flex wrap gap-2 center-y"
                            style="flex: {widget.grow || 1} 0 0%;"
                        >
                            {@html widget.text}
                        </div>
                    {:else if widget.widget_type === "button"}
                        <button
                            class="border flex wrap center"
                            style="flex: {widget.grow || 1} 0 0%;"
                        >
                            {@html widget.text}
                        </button>
                    {:else if widget.widget_type === "spacer"}
                        <div style="flex: {widget.grow || 1} 0 0%;">&nbsp;</div>
                    {:else if widget.widget_type === "slider"}
                        <Slider
                            label={widget.text}
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
