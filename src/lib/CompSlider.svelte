<script lang="ts">
    let {
        value = $bindable(50),
        label = "",
        max = 100,
        min = 0,
        step = 1,
        units = "%",
        title = "",
        classList = "",
        styleList = "",
        disabled = false,
        // subscribeValue,
    } = $props();

    let id = `slider-${Math.random()}`;

    const percent = $derived(((value - min) / (max - min)) * 100);
    const background = $derived(`linear-gradient(
        to right,
        var(--bg-light) 0% ${percent}%,
        var(--bg-dark) ${percent}% 100%)`);
</script>

<div class="grid gap-4" style={styleList}>
    {#if label !== ""}
        <label for={id} class="flex gap-4">
            <span class="grow flex wrap gap-2 center-y"> {@html label} </span>
            <output>{value} {units}</output>
        </label>
    {/if}

    <input
        type="range"
        {id}
        {max}
        {min}
        {step}
        {title}
        {disabled}
        bind:value
        class={classList}
        style={`background: ${background};`}
    />
</div>
