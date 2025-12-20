<script lang="ts">
    import { onMount } from "svelte";

    const { opacity = 0.5, time_min = 5 } = $props();

    let blackout = $state(false);
    let blackout_timeout: number | undefined;
    function reset_blackout_timeout() {
        if (blackout_timeout) clearTimeout(blackout_timeout);
        blackout_timeout = setTimeout(
            () => {
                blackout = true;
                console.log(
                    `Blackout triggered after ${time_min} minute(s) of inactivity`,
                );
            },
            time_min * 60 * 1000,
        );
    }

    onMount(async () => {
        reset_blackout_timeout();
        ["click", "touchstart", "mousemove"].forEach((evt) =>
            document.addEventListener(evt, reset_blackout_timeout, false),
        );
    });
</script>

{#if blackout}
    <button
        title="Exit Blackout"
        style="opacity: {opacity};"
        onclick={() => (blackout = false)}
    ></button>
{/if}

<style>
    button {
        z-index: 99;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: none;
        border-radius: 0;
        background-color: black;
    }
    button:hover {
        background-color: black !important;
    }
</style>
