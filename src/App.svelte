<script lang="ts">
    import { onMount } from "svelte";
    import { config } from "./js/config.svelte";

    // Components
    import Split from "./lib/Split.svelte";
    import TestPage from "./lib/TestPage.svelte";
    import BasicPage from "./lib/BasicPage.svelte";
    import MatrixPage from "./lib/MatrixPage.svelte";
    import ConfigPage from "./lib/ConfigPage.svelte";

    // XPanel Connect to Control System
    import { xpConnect } from "./js/webxpanel.svelte";
    const urlSearchParams = new URLSearchParams(window.location.search);
    const editMode = urlSearchParams.get("edit") || false;
    const paramIp = urlSearchParams.get("ip") || "172.22.0.1";
    const ip = location.port === "5173" ? paramIp : location.hostname;
    const ipid = urlSearchParams.get("ipid") || "0x03";
    const roomid = urlSearchParams.get("roomid") || "1";
    const token =
        urlSearchParams.get("token") ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzMjhiYmMwLWFlYWYtNGI0OC05MGJjLTAwMmI4MjkwYmFlNCIsImx2IjoiRGVmYXVsdCBMZXZlbCIsInZlciI6IjEuMCIsImV4cGkiOiIwIn0.h6cUVnbGogzwcszdNawI4ffovCYYOoDX1hN4NudO7ys";
    const xp = xpConnect(ip, ipid, roomid, token);

    onMount(async () => {
        await config.get_from_server("/public/config/example.json");
        
    });

    $effect(() => {
        if (config.active.client?.theme) {
            document.getElementsByTagName( 'html' )[0].classList = config.active.client.theme
        }
    })

    let page_width = $state(0)
    $inspect(page_width)
</script>

<main class="flex column gap-8 height-100">
    {#if !xp.isConnected}
        <div class="pad-4 grid gap-1">
            <div>Status: {xp.status}</div>
            <div>Host/IP: {xp.host}</div>
            <div>IPID: {xp.ipId}</div>
            <div>RoomID: {xp.roomId}</div>
            <br /><br />
            <div>
                <button class="border" onclick={() => location.reload()}>Reload</button>
            </div>
        </div>
    {:else if editMode}
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
                    <ConfigPage />
                </div>
            {/snippet}

            {#snippet b()}
                <div class="pad-4 grow grid center-y margin-auto max-width-md" style="font-size: {page_width > 450 ? config.active.client.scale : config.active.client.scale_small}em;" bind:offsetWidth={page_width} >
                    <MatrixPage />
                </div>
            {/snippet}
        </Split>
    {:else}
        <div class="pad-4 grow grid center-y margin-auto max-width-md height-100 width-100" style="font-size: {page_width > 450 ? config.active.client.scale : config.active.client.scale_small}em;" bind:offsetWidth={page_width} >
            <MatrixPage />
        </div>
    {/if}
</main>
