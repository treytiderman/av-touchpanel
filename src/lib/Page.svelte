<script lang="ts">
    import { onMount } from "svelte";
    import { config } from "../js/config.svelte";

    import PageRows from "../lib/PageRows.svelte";
    import PageMatrix from "../lib/PageMatrix.svelte";

    let { page_id = "" } = $props();

    let page: any = $state({ page_type: "blank", page_id: "blank" });

    onMount(async () => {
        const new_page = $state(config.get_page_by_id(page_id));
        if (new_page) page = new_page;
    });

    let reload_timeout: number;
    function reload_timer() {
        reload_timeout = setTimeout(location.reload, 10_000);
    }
</script>

<svelte:document
    onpointerdown={reload_timer}
    onpointerout={() => clearTimeout(reload_timeout)}
    onpointerup={() => clearTimeout(reload_timeout)}
/>

{#if page && page.page_type === false}
    <div>{JSON.stringify(page, null, 4)}</div>
{:else if page?.page_type === "rows"}
    <PageRows bind:page />
{:else if page?.page_type === "matrix"}
    <PageMatrix bind:page />
{:else if page?.page_type === "blank"}
    <div>...</div>
{/if}
