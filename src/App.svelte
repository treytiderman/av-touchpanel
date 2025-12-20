<script lang="ts">
    import { config } from "./js/config.svelte";

    import PageBlackout from "./lib/PageBlackout.svelte";
    import PageConfig from "./lib//PageConfig.svelte";

    console.log("av-touchpanel init");
</script>

<PageBlackout
    opacity={1.0}
    time_min={config.active.client?.blackout_timeout_min || 15}
/>

<main class="flex column gap-8 height-100">
    <PageConfig />
</main>
