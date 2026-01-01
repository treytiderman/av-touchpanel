<script lang="ts">
    import { backend } from "../js/backend.svelte";
    import {
        config,
        flat_to_nested_config,
        get_array_length_flat_config,
        remove_index_in_flat_obj,
    } from "../js/config.svelte";

    let autosave = $state(true);
    let focus_next = $state(false);
    let details_open_state: any = $state({});
    // $inspect("details_open_state", details_open_state);
    // $inspect("config.active", config.active);
    // $inspect("config.working_flat", config.working_flat);

    $effect(() => {
        if (!focus_next) return;
        console.log("config.focus_path", config.focus_path);
        for (const key in details_open_state) details_open_state[key] = true;
        setTimeout(() => {
            let el = document.getElementById(config.focus_path);
            if (el) console.log("el.focus()", el, el.focus());
        }, 1);
    });
</script>

<section class="flex column height-100" style="align-content: start;">
    <div class="flex column gap-4 pad-4 border-bottom">
        <div class="flex wrap gap-4">
            <button
                class="border"
                onclick={() => {
                    const clipboard = flat_to_nested_config(
                        config.working_flat,
                    );
                    navigator.clipboard.writeText(
                        JSON.stringify(clipboard, null, 4),
                    );
                }}
            >
                Copy
            </button>
            <button
                class="border"
                onclick={() => {
                    backend.save_config();
                }}
            >
                Save
            </button>
            <div class="flex wrap gap-4">
                <button
                    class="border"
                    onclick={() => {
                        for (const key in details_open_state) {
                            details_open_state[key] = true;
                        }
                    }}
                >
                    Expand
                </button>
            </div>
            <div class="flex wrap gap-4">
                <button
                    class="border"
                    onclick={() => {
                        for (const key in details_open_state) {
                            details_open_state[key] = false;
                        }
                    }}
                >
                    Collapse
                </button>
            </div>
        </div>

        <div>
            <input
                type="checkbox"
                name="focus_next"
                id="focus_next"
                class="border"
                bind:checked={focus_next}
            />
            <label for="focus_next">Focus next button/input</label>
        </div>
        <div>
            <input
                type="checkbox"
                name="autosave"
                id="autosave"
                class="border"
                bind:checked={autosave}
                onclick={config.set_from_working}
            />
            <label for="autosave">Show changes</label>
        </div>

        <div class="text-dark thin small">
            *empty fields are assumed default
        </div>
    </div>

    <div class="flex column gap-4 grow pad-4 overflow">
        {#each Object.entries(config.schema.properties) as prop}
            {@render property(`#/${prop[0]}`, prop[0], prop[1])}
        {/each}
    </div>
</section>

{#snippet property(path: string, key: string, obj: any)}
    {#if obj.enum && obj.enum.length > 0}
        <div>
            <label class="grid gap-1">
                <div class="flex gap-2 bottom">
                    <div title={obj.description}>{key}</div>
                    <div class="text-dark thin small">{obj.type}</div>
                </div>
                <select
                    class="border xshadow"
                    id={path}
                    title={path}
                    value={config.working_flat[path]}
                    oninput={(event) => {
                        const target = event.target as HTMLInputElement;
                        if (obj.type === "integer" || obj.type === "number") {
                            config.working_flat[path] = Number(target.value);
                        } else {
                            config.working_flat[path] = target.value;
                        }
                        if (autosave) config.set_from_working();
                    }}
                >
                    <option value="">default ({obj.default})</option>
                    {#each obj.enum as opt}
                        <option value={opt}>{opt}</option>
                    {/each}
                </select>
            </label>
        </div>
    {:else if obj.type === "integer"}
        <div>
            <label class="grid gap-1">
                <div class="flex gap-2 bottom">
                    <div title={obj.description}>{key}</div>
                    <div class="text-dark thin small">{obj.type}</div>
                </div>
                <input
                    type="number"
                    class="border xshadow-inset"
                    id={path}
                    title={path}
                    step="1"
                    max={obj.maximum}
                    min={obj.minimum}
                    placeholder={String(obj.default) || "0"}
                    value={config.working_flat[path]}
                    oninput={(event) => {
                        const target = event.target as HTMLInputElement;
                        config.working_flat[path] = Number(target.value);
                        if (autosave) config.set_from_working();
                    }}
                />
            </label>
        </div>
    {:else if obj.type === "number"}
        <div>
            <label class="grid gap-1">
                <div class="flex gap-2 bottom">
                    <div title={obj.description}>{key}</div>
                    <div class="text-dark thin small">{obj.type}</div>
                </div>
                <input
                    type="number"
                    class="border xshadow-inset"
                    id={path}
                    title={path}
                    step={obj.multipleOf}
                    max={obj.maximum}
                    min={obj.minimum}
                    placeholder={String(obj.default) || "0"}
                    value={config.working_flat[path]}
                    oninput={(event) => {
                        const target = event.target as HTMLInputElement;
                        config.working_flat[path] = Number(target.value);
                        if (autosave) config.set_from_working();
                    }}
                />
            </label>
        </div>
    {:else if obj.type === "string"}
        <div>
            <label class="grid gap-1">
                <div class="flex gap-2 bottom">
                    <div title={obj.description}>{key}</div>
                    <div class="text-dark thin small">{obj.type}</div>
                </div>
                <input
                    type="text"
                    class="border xshadow-inset"
                    id={path}
                    title={path}
                    placeholder={String(obj.default) || ""}
                    value={config.working_flat[path]}
                    oninput={(event) => {
                        const target = event.target as HTMLInputElement;
                        config.working_flat[path] = target.value;
                        if (autosave) config.set_from_working();
                    }}
                />
            </label>
        </div>
    {:else if obj.type === "object" && obj.properties}
        <details
            bind:open={details_open_state[path]}
            {@attach (element) => {
                details_open_state[path] = false;
            }}
        >
            <summary class="flex gap-2 center-y border-radius">
                <div class="flex gap-2 bottom">
                    <div title={"description" in obj ? obj.description : ""}>
                        {key}
                    </div>
                    <div class="text-dark thin small">{obj.type}</div>
                </div>
            </summary>
            {#if "properties" in obj}
                <div
                    class="grid gap-4"
                    style="padding: 0.75rem 0 0 1rem; border-left: var(--border); border-top: var(--border); "
                >
                    {#each Object.entries(obj.properties) as prop}
                        {@render property(
                            `${path}/${prop[0]}`,
                            prop[0],
                            prop[1],
                        )}
                    {/each}
                    {#if obj.allOf && obj.allOf.length > 0}
                        {#each obj.allOf as allOf}
                            <!-- check the if condition of this "allOf" -->
                            {#if config.working_flat[`${path}/${[Object.entries(allOf.if.properties)[0][0]]}`] === (Object.entries(allOf.if.properties)[0][1] as any).const}
                                {#each Object.entries(allOf.then.properties) as prop}
                                    {@render property(
                                        `${path}/${prop[0]}`,
                                        prop[0],
                                        prop[1],
                                    )}
                                {/each}
                            {/if}
                        {/each}
                    {/if}
                </div>
            {/if}
        </details>
    {:else if obj.type === "array" && obj.properties}
        <details
            bind:open={details_open_state[path]}
            {@attach (element) => {
                details_open_state[path] = false;
            }}
        >
            <summary class="flex gap-2 center-y border-radius">
                <div class="flex gap-2 bottom grow">
                    <div title={"description" in obj ? obj.description : ""}>
                        {key}
                    </div>
                    <div class="text-dark thin small">
                        {obj.type}({get_array_length_flat_config(
                            config.working_flat,
                            path,
                        )})
                    </div>
                </div>
                <button
                    class="text-dark transparent"
                    aria-label="Add item to array {path}"
                    title="Add item to array {path}"
                    onclick={() => {
                        console.log(
                            config.working_flat,
                            path,
                            config.working_flat[path],
                        );
                        config.working_flat[
                            path +
                                "/" +
                                get_array_length_flat_config(
                                    config.working_flat,
                                    path,
                                )
                        ] = "";
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                    </svg>
                </button>
            </summary>
            {#if "properties" in obj}
                <div class="grid gap-4">
                    {#each Array(get_array_length_flat_config(config.working_flat, path)) as _, index}
                        <details
                            id="array-{path}/{index}"
                            style="padding: 0.75rem 0 0 1rem; border-left: var(--border); border-top: var(--border); "
                            bind:open={details_open_state[`${path}/${index}`]}
                            {@attach (element) => {
                                details_open_state[`${path}/${index}`] = false;
                            }}
                        >
                            <summary class="flex gap-2 center-y grow">
                                <div class="text-dark grow">{index}</div>
                                <button
                                    class="text-dark transparent"
                                    aria-label="Remove item from array {path}/{index}"
                                    title="Remove item from array {path}/{index}"
                                    onclick={() => {
                                        config.working_flat =
                                            remove_index_in_flat_obj(
                                                config.working_flat,
                                                path,
                                                index,
                                            );
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path
                                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                                        />
                                        <path d="M3 6h18" />
                                        <path
                                            d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                        />
                                    </svg>
                                </button>
                            </summary>
                            <div class="grid gap-4">
                                {#each Object.entries(obj.properties) as prop}
                                    {@render property(
                                        `${path}/${index}/${prop[0]}`,
                                        prop[0],
                                        prop[1],
                                    )}
                                {/each}
                                {#if obj.allOf && obj.allOf.length > 0}
                                    {#each obj.allOf as allOf}
                                        {#if config.working_flat[`${path}/${index}/${[Object.entries(allOf.if.properties)[0][0]]}`] === (Object.entries(allOf.if.properties)[0][1] as any).const}
                                            {#each Object.entries(allOf.then.properties) as prop}
                                                {@render property(
                                                    `${path}/${index}/${prop[0]}`,
                                                    prop[0],
                                                    prop[1],
                                                )}
                                            {/each}
                                        {/if}
                                    {/each}
                                {/if}
                            </div>
                        </details>
                    {/each}
                </div>
            {/if}
        </details>
    {/if}
{/snippet}
