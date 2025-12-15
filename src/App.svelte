<script lang="ts">
    import { onMount } from "svelte";
    import { config } from "./js/config.svelte";

    import Split from "./lib/Split.svelte";
    import ConfigPanel from "./lib/ConfigPanel.svelte";
    import Page from "./lib/Page.svelte";

    let page_width = $state(0);

    onMount(async () => {
        console.log("av-touchpanel init");
        await config.get_from_server("/public/config/example.json");
        console.log("page_id_active", config.active.client.page_id_active);
    });

    $effect(() => {
        if (config.active.client?.theme) {
            document.getElementsByTagName("html")[0].classList =
                config.active.client.theme;
        }
    });
</script>

<main class="flex column gap-8 height-100">
    {#if !config.ready}
        <div class="pad-4 grid gap-1">
            <div>Status: No Config + Not Connected to Backend</div>
            <br /><br />
            <div>
                <button class="border" onclick={() => location.reload()}>
                    Reload
                </button>
            </div>
        </div>
    {:else if config.edit_mode } <!-- EXAMPLE: http://192.168.1.11:9001/?edit=true -->
        <Split
            type="columns"
            id="main"
            min="200px"
            max="-200px"
            pos="24rem"
            --color={"var(--border-color)"}
            --thickness={"24px"}
        >
            {#snippet a()}
                <div class="pad-4" style="height: 100dvh;">
                    <ConfigPanel />
                </div>
            {/snippet}

            {#snippet b()}
                <div
                    class="pad-4 grow grid center-y margin-auto max-width-md"
                    style="font-size: {page_width > 450
                        ? config.active.client?.scale
                        : config.active.client?.scale_small}em;"
                    bind:offsetWidth={page_width}
                >
                    <Page page_id={config.active.client?.page_id_active} />
                </div>
            {/snippet}
        </Split>
    {:else}
        <div
            class="pad-4 grow grid center-y margin-auto max-width-md height-100 width-100"
            style="font-size: {page_width > 450
                ? config.active.client.scale
                : config.active.client.scale_small}em;"
            bind:offsetWidth={page_width}
        >
            <Page page_id={config.active.client?.page_id_active} />
        </div>
    {/if}
</main>
