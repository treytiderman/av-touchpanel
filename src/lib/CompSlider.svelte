<script lang="ts">
    const {
        label = "",
        value = 50,
        max = 100,
        min = 0,
        units = "%",
        title = "",
        classList = "",
        styleList = "",
        disabled = false,
        valueChange,
    } = $props();

    let sliderValue = $state(value);
    let id = crypto.randomUUID();

    const percent = $derived(((sliderValue - min) / (max - min)) * 100);
    const background = $derived(`linear-gradient(
        to right,
        var(--bg-light) 0% ${percent}%,
        var(--bg-dark) ${percent}% 100%)`);

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        sliderValue = Number(target.value);
        valueChange(sliderValue);
    }
</script>

<div class="grid gap-4" style={styleList}>
    {#if label !== ""}
        <label for={id} class="flex gap-4">
            <span class="grow flex wrap gap-2 center-y"> {@html label} </span>
            <output>{sliderValue} {units}</output>
        </label>
    {/if}

    <input
        type="range"
        {id}
        {max}
        {min}
        {title}
        {disabled}
        class={classList}
        style={`background: ${background};`}
        value={sliderValue}
        oninput={handleInput}
    />
</div>
