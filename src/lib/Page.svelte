<script lang="ts">
    import { onMount } from "svelte";
    import { config } from "../js/config.svelte";

    import PageRows from "../lib/PageRows.svelte";
    import PageMatrix from "../lib/PageMatrix.svelte";

    const { page_id = "" } = $props();

    let page: any = $state({ page_type: "blank", page_id: "blank" });

    onMount(async () => {
        const new_page = config.get_page_by_id(page_id);
        if (new_page) page = new_page;
    });
</script>

{#if page && page.page_type === false}
    <div>{JSON.stringify(page, null, 4)}</div>
{:else if page?.page_type === "rows"}
    <PageRows {page} />
{:else if page?.page_type === "matrix"}
    <PageMatrix />
{:else if page?.page_type === "blank"}
    <div>...</div>
{/if}
