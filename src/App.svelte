<script lang="ts">
    import TestPage from "./lib/TestPage.svelte";
    import { xpConnect } from "./js/webxpanel.svelte";

    // XPanel Connect to Control System
    const urlSearchParams = new URLSearchParams(window.location.search);
    const paramIp = urlSearchParams.get("ip") || "172.22.0.1";
    const ip = location.port === "5173" ? paramIp : location.hostname;
    const ipid = urlSearchParams.get("ipid") || "0x03";
    const roomid = urlSearchParams.get("roomid") || "1";
    const token = urlSearchParams.get("token") || 
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzMjhiYmMwLWFlYWYtNGI0OC05MGJjLTAwMmI4MjkwYmFlNCIsImx2IjoiRGVmYXVsdCBMZXZlbCIsInZlciI6IjEuMCIsImV4cGkiOiIwIn0.h6cUVnbGogzwcszdNawI4ffovCYYOoDX1hN4NudO7ys";
    const xp = xpConnect(ip, ipid, roomid, token);
</script>

<main class="pad-4 grid gap-8 margin-auto max-width-md">
    {#if !xp.isConnected}
        <div class="grid gap-1">
            <div>Status: {xp.status}</div>
            <div>Host/IP: {xp.host}</div>
            <div>IPID: {xp.ipId}</div>
            <div>RoomID: {xp.roomId}</div>
            <br /><br />
            <div>
                <button class="border" onclick={() => location.reload()}>Reload</button>
            </div>
        </div>
    {:else}
        <TestPage />
    {/if}
</main>
