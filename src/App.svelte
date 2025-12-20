<script lang="ts">
    import { config } from "./js/config.svelte";

    import PageBlackout from "./lib/PageBlackout.svelte";
    import ConfigWrapper from "./lib/ConfigWrapper.svelte";
    import Page from "./lib/Page.svelte";

    console.log("av-touchpanel: init");
</script>

<PageBlackout
    opacity={1.0}
    time_min={config.active.client?.blackout_timeout_min || 15}
/>

<main class="flex column gap-8 height-100">
    <ConfigWrapper>
        {#snippet page()}
            <Page page_id={config.active.client?.page_id_active} />
        {/snippet}
    </ConfigWrapper>
</main>
