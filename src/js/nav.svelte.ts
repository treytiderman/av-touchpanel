import { config } from "../js/config.svelte";

export { nav };

const nav: {
    page: any;
    get_page: (id: string) => any;
    get_page_index: (id: string) => number;
    set_page: (id: string) => void;
} = $state({
    page: { title: "", page_id: "", page_type: "" },
    get_page: get_page,
    set_page: set_page,
    get_page_index: get_page_index,
});

function get_page(id: string) {
    return config.active.page_list?.find(
        (page: { page_id: string }) => page.page_id === id,
    );
}

function get_page_index(id: string) {
    return config.active.page_list?.findIndex(
        (page: { page_id: string }) => page.page_id === id,
    );
}

function set_page(id: string) {
    nav.page = get_page(id);
    console.log("nav.page", $state.snapshot(nav.page));
}
