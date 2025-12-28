<script lang="ts">
    import { onMount } from "svelte";
    import { nav } from "../js/nav.svelte";
    import { config } from "../js/config.svelte";

    import PageRows from "../lib/PageRows.svelte";
    import PageMatrix from "../lib/PageMatrix.svelte";

    let { page_id = "" } = $props();

    // let page: any = $state({ page_type: "blank", page_id: "blank" });

    let page = $derived(nav.get_page(page_id));
    let page_index = $derived(nav.get_page_index(page_id));

    // onMount(async () => {
    //     // const new_page = $state(config.get_page_by_id(page_id));
    //     // if (new_page) page = new_page;
    // });
    // // $inspect("page_id_derived", page_id_derived);

    let reload_timeout: number;
    function reload_timer() {
        reload_timeout = setTimeout(() => location.reload(), 10_000);
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
    <PageRows {page} {page_index} />
{:else if page?.page_type === "matrix"}
    <PageMatrix {page} {page_index} />
{:else if page?.page_type === "blank"}
    <div>...</div>
{/if}
