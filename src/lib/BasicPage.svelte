<script lang="ts">
    import { config } from "../js/config.svelte";
    import Slider from "../lib/Slider.svelte";

    const index = 0;
    console.log("config.active.page_list[index].rows", config.active.page_list[index].rows);
</script>

<div class="grid gap-8">
    {#if config.active.page_list[index].title}
        <h2 class="flex wrap gap-2 center-y">{@html config.active.page_list[index].title}</h2>
    {/if}

    <div class="grid gap-4">
        {#each config.active.page_list[index].rows as row}
            <div class="flex wrap gap-4">
                {#each row.widgets as widget}
                    {#if widget.widget_type === "text"}
                        <div class="flex wrap gap-2 center-y" style="flex: {widget.grow || 1} 0 0%;">
                            {@html widget.text}
                        </div>
                    {:else if widget.widget_type === "button"}
                        <button class="border flex wrap center" style="flex: {widget.grow || 1} 0 0%;">
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
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</div>
