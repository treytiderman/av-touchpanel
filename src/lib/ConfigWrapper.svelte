<script lang="ts">
    import type { Snippet } from "svelte";

    import { onMount } from "svelte";
    import { config } from "../js/config.svelte";

    import Split from "../lib/CompSplit.svelte";
    import ConfigPanel from "../lib/ConfigPanel.svelte";

    const { page }: { page: Snippet } = $props();

    let page_width = $state(0);
    let tried = $state(false);

    onMount(async () => {
        await config.get_from_server(config.url_params.config_file);
        await config.connect_to_server();
        tried = true;
    });
</script>

{#if tried && !config.ready}
    <div class="pad-4 grid gap-1 max-width-sm">
        <div>Status: No Config</div>

        <div class="flex bottom gap-2">
            <div>try adding</div>
            <code>/?config=/public/config/example.json</code>
            <div>to the end of the url</div>
        </div>

        <br />
        <div>
            <button class="border" onclick={() => location.reload()}>
                Reload
            </button>
        </div>
    </div>
{:else if tried && !config.server_connected}
    <div class="pad-4 grid gap-1 max-width-sm">
        <div>Status: Not Connected to Backend Server</div>

        <br />
        <div>
            <button class="border" onclick={() => location.reload()}>
                Reload
            </button>
        </div>

        <br />
        <div class="pad-4 bg border-radius overflow">
            <pre><code>{JSON.stringify(config.active.server, null, 4)}</code
                ></pre>
        </div>
    </div>
{:else if tried && config.url_params.edit_mode}
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
            <div style="height: 100dvh;">
                <ConfigPanel />
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
                {@render page()}
            </div>
        {/snippet}
    </Split>
{:else if tried}
    <div
        class="pad-4 grow grid center-y margin-auto max-width-md height-100 width-100"
        style="font-size: {page_width > 550
            ? config.active.client.scale
            : config.active.client.scale_small}em;"
        bind:offsetWidth={page_width}
    >
        {@render page()}
    </div>
{/if}
