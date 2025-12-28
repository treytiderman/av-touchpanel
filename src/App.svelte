<script lang="ts">
    import { config } from "./js/config.svelte";
    import { nav } from "./js/nav.svelte";

    import CompBlackout from "./lib/CompBlackout.svelte";
    import ConfigWrapper from "./lib/ConfigWrapper.svelte";
    import Page from "./lib/Page.svelte";

    console.log("av-touchpanel: init");
</script>

<CompBlackout
    opacity={0.9}
    time_min={config.active.client?.blackout_timeout_min || 15}
/>

<main class="flex column gap-8 height-100">
    <ConfigWrapper>
        {#snippet page()}
            <Page page_id={nav.page?.page_id} />
            <!-- <pre class="small">{JSON.stringify(nav.page, null, 4)}</pre> -->
        {/snippet}
    </ConfigWrapper>
</main>
