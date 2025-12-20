<script lang="ts">
    import { onMount } from "svelte";
    import { config } from "../js/config.svelte";

    import Split from "../lib/CompSplit.svelte";
    import PageConfigSidePanel from "../lib/PageConfigSidePanel.svelte";
    import Page from "../lib/Page.svelte";

    let page_width = $state(0);

    onMount(async () => {
        await config.get_from_server(config.url_params.config_file);
        // console.log("page_id_active", config.active.client.page_id_active);
    });
</script>

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
{:else if config.url_params.edit_mode}
    <!-- EXAMPLE: http://192.168.1.11:9001/?edit=true -->
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
                <PageConfigSidePanel />
            </div>
        {/snippet}

        {#snippet b()}
            <div
                class="pad-4 grow grid center-y margin-auto max-width-md"
                style="font-size: {page_width > 550
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
        style="font-size: {page_width > 550
            ? config.active.client.scale
            : config.active.client.scale_small}em;"
        bind:offsetWidth={page_width}
    >
        <Page page_id={config.active.client?.page_id_active} />
    </div>
{/if}
