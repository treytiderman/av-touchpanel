<script lang="ts">
    import TestPage from "./lib/TestPage.svelte";
    import { xpConnect } from "./js/webxpanel.svelte";

    // XPanel Connect to Control System
    const ip = location.port === "5173" ? "172.22.1.1" : location.hostname;
    const ipid = "0x03";
    const roomid = "1";
    const token =
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
