<script lang="ts">
    import {
        useDigital,
        useAnalog,
        useSerial,
        pulseDigital,
        setAnalog,
        setDigital,
        setSerial,
    } from "ch5-svelte";

    // Crestron SIMPL Signals
    const d1 = useDigital("1"); // toggle.press
    const d2 = useDigital("2"); // analog.up.press
    const d3 = useDigital("3"); // analog.down.press
    const d4 = useDigital("4"); // analog.mute.press
    const d5 = useDigital("5"); // serial.optionl.press
    const d6 = useDigital("6"); // serial.option2.press
    const d7 = useDigital("7"); // serial.option3.press
    const a1 = useAnalog("1"); // analog.fb
    const a2 = useAnalog("2"); // analog.set
    const s1 = useSerial("1"); // serial.option.selected
    const s2 = useSerial("2"); // serial.set
    const s3 = useSerial("3"); // room.id
    const s4 = useSerial("4"); // room.name
</script>

<div class="grid gap-8">
    <div class="grid gap-1">
        <div class="flex gap-2">
            <span class="text-dark thin">room id: </span>
            <span>{s3.value}</span>
        </div>
        <div class="flex gap-2">
            <span class="text-dark thin">room name: </span>
            <span>{s4.value}</span>
        </div>
    </div>
    <div class="grid gap-1">
        <div class="flex gap-2">
            <span class="text-dark thin">digital 1: </span>
            <span>{d1.value}</span>
        </div>
        <div class="flex center-y wrap gap-4">
            <button class="border shadow" onclick={() => d1.pulse()}>
                toggle
            </button>
        </div>
    </div>

    <div class="grid gap-1">
        <div class="flex gap-2">
            <span class="text-dark thin">analog 1: </span>
            <span>{a1.value}</span>
        </div>
        <div class="flex gap-2">
            <span class="text-dark thin">digital 2/3/4: </span>
            <span>{d2.value}</span> /
            <span>{d3.value}</span> /
            <span>{d4.value}</span>
        </div>
        <div class="flex center-y wrap gap-4">
            <button
                class="border shadow"
                onpointerup={() => (d2.value = false)}
                onpointerout={() => (d2.value = false)}
                onpointerdown={() => (d2.value = true)}
                oncontextmenu={(e) => e.preventDefault()}
            >
                up [d2]
            </button>
            <button
                class="border shadow"
                onpointerup={() => (d3.value = false)}
                onpointerout={() => (d3.value = false)}
                onpointerdown={() => (d3.value = true)}
                oncontextmenu={(e) => e.preventDefault()}
            >
                down [d3]
            </button>
            <button
                class="border shadow"
                onpointerup={() => (d4.value = false)}
                onpointerout={() => (d4.value = false)}
                onpointerdown={() => (d4.value = true)}
                oncontextmenu={(e) => e.preventDefault()}
            >
                mute [d4]
            </button>
        </div>
    </div>

    <div class="grid gap-1">
        <div class="flex gap-2">
            <span class="text-dark thin">serial 1: </span>
            <span>{s1.value}</span>
        </div>
        <div class="flex center-y wrap gap-4">
            <button class="border shadow" onclick={() => d5.pulse()}>
                option 1 [d5]
            </button>
            <button class="border shadow" onclick={() => d6.pulse()}>
                option 2 [d6]
            </button>
            <button class="border shadow" onclick={() => d7.pulse()}>
                option 3 [d7]
            </button>
        </div>
    </div>

    <div class="grid gap-1">
        <label for="analog2" class="flex gap-2">
            <span class="text-dark thin">analog 2: </span>
            <span>{a2.value}</span>
        </label>
        <div class="flex wrap center-y gap-4">
            <input
                type="number"
                name="analog2"
                id="analog2"
                min="0"
                max="65535"
                step="1000"
                class="border shadow-inset"
                bind:value={a2.value}
            />
            <progress value={a2.value} max="65000" class="border shadow grow"
            ></progress>
        </div>
    </div>

    <div class="grid gap-1">
        <label for="serial2" class="flex gap-2">
            <span class="text-dark thin">serial 2: </span>
            <span>{s2.value}</span>
        </label>
        <div class="flex wrap center-y gap-4">
            <input
                type="text"
                name="serial2"
                id="serial2"
                maxlength="16"
                class="border shadow-inset"
                bind:value={s2.value}
            />
        </div>
    </div>
</div>
