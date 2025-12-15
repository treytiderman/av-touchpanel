<script lang="ts">
    import { onMount } from "svelte";
    import { config } from "../js/config.svelte";

    import RowsPage from "../lib/RowsPage.svelte";
    import MatrixPage from "../lib/MatrixPage.svelte";

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
    <RowsPage {page} />
{:else if page?.page_type === "matrix"}
    <MatrixPage />
{:else if page?.page_type === "blank"}
    <div>...</div>
{/if}
