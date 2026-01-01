import { config } from "../js/config.svelte";
import { xpConnect } from "../js/backend-crestron.svelte";
import * as crestron from "./ch5-svelte/js";

const urlSearchParams = new URLSearchParams(window.location.search);

const backend: {
    connect: () => Promise<void>;
    connected: boolean;
    pulseBoolean: (control_id: string) => void;
    setBoolean: (control_id: string, value: boolean) => void;
    setNumber: (control_id: string, value: number) => void;
    setString: (control_id: string, value: string) => void;
    subscribeBoolean: (
        fbSignal: string,
        setSignal?: string,
    ) => { value: boolean; pulse: () => void } | undefined;
    subscribeInteger: (
        fbSignal: string,
        setSignal?: string,
    ) => { value: number } | undefined;
    subscribeString: (
        fbSignal: string,
        setSignal?: string,
    ) => { value: string } | undefined;
    save_config: () => void;
    url_params: {
        ip: string;
        ipid: string;
        roomid: string;
        token: string;
    };
} = $state({
    connect: connect,
    connected: false,
    pulseBoolean,
    setBoolean,
    setNumber,
    setString,
    subscribeBoolean,
    subscribeInteger,
    subscribeString,
    save_config,
    url_params: {
        ip: urlSearchParams.get("ip") || location.hostname,
        ipid: urlSearchParams.get("ipid") || "0x03",
        roomid: urlSearchParams.get("roomid") || "1",
        token: urlSearchParams.get("token") || "",
    },
});

export { backend };

async function connect() {
    if (config.active.backend?.type === "crestron") {
        console.log("backend: backend = crestron");
        const xp = await xpConnect(
            config.active.backend.host,
            config.active.backend.ipid,
            config.active.backend.roomid,
            config.active.backend.token,
        );
        backend.connected = xp.isConnected;
    } else if (config.active.backend?.type === "qsys") {
        // const xp = xpConnect(ip, ipid, roomid, token);
    } else {
        console.log("server: backend = offline");
        backend.connected = true;
    }
}

function pulseBoolean(control_id: string) {
    console.log(
        `control [${config.active.backend?.type}]: pulseBoolean ${control_id}`,
    );
    if (config.active.backend?.type === "crestron") {
        crestron.pulseDigital(control_id);
    } else if (config.active.backend?.type === "qsys") {
        // qsys.pulseBoolean
    }
}

function setBoolean(control_id: string, value: boolean) {
    console.log(
        `control [${config.active.backend?.type}]: setBoolean ${control_id} to ${value}`,
    );
    if (config.active.backend?.type === "crestron") {
        crestron.setDigital(control_id, value);
    } else if (config.active.backend?.type === "qsys") {
        // qsys.setBoolean
    }
}

function setNumber(control_id: string, value: number) {
    console.log(
        `control [${config.active.backend?.type}]: setNumber ${control_id} to ${value}`,
    );
    if (config.active.backend?.type === "crestron") {
        crestron.setAnalog(control_id, value);
    } else if (config.active.backend?.type === "qsys") {
        // qsys.setNumber
    }
}

function setString(control_id: string, value: string) {
    console.log(
        `control [${config.active.backend?.type}]: setString ${control_id} to ${value}`,
    );
    if (config.active.backend?.type === "crestron") {
        crestron.setSerial(control_id, value);
    } else if (config.active.backend?.type === "qsys") {
        // qsys.setString
    }
}

function subscribeBoolean(control_id: string) {
    console.log(
        `control [${config.active.backend?.type}]: subscribeBoolean ${control_id}`,
    );
    if (config.active.backend?.type === "crestron") {
        return crestron.useDigital(control_id);
    } else if (config.active.backend?.type === "qsys") {
        // qsys.subscribeBoolean
    }
}

function subscribeInteger(control_id: string) {
    console.log(
        `control [${config.active.backend?.type}]: subscribeInteger ${control_id}`,
    );
    if (config.active.backend?.type === "crestron") {
        // x > 32767 ? x -= 65536 : x
        return crestron.useAnalog(control_id);
    } else if (config.active.backend?.type === "qsys") {
        // qsys.subscribeInteger
    }
}

function subscribeString(control_id: string) {
    console.log(
        `control [${config.active.backend?.type}]: subscribeString ${control_id}`,
    );
    if (config.active.backend?.type === "crestron") {
        return crestron.useSerial(control_id);
    } else if (config.active.backend?.type === "qsys") {
        // qsys.subscribeString
    }
}

function save_config() {
    console.log(
        `control [${config.active.backend?.type}]: save_config to ${config.active.backend?.out_string_saved_config}`,
        config.active,
    );
    config.set_from_working();
    if (
        config.active.backend?.type === "crestron" &&
        config.active.backend?.out_string_saved_config
    ) {
        const config_path = config.active.backend.config_path;
        const id_config_path = config.active.backend.out_string_config_path;
        const id_saved_config = config.active.backend.out_string_saved_config;
        const json_to_send = JSON.stringify(config.active);
        // const json_to_send = `"JSON TEST STRING"`;
        console.log(
            `control [CRESTRON]: config_path to ${id_config_path}`,
            config_path,
        );
        console.log(`control [CRESTRON]: save_config to ${id_saved_config}`);

        // Split the JSON string into chunks of 255 characters (limitation of Crestron WebXPanel)
        // Send each chunk as a separate serial command and delay for 10ms between each chunk
        // send_as_chunks(id_saved_config, json_to_send, 10);
        crestron.setSerial(id_config_path, config_path);
        setTimeout(() => send_as_chunks(id_saved_config, json_to_send, 10), 10);
    } else if (config.active.backend?.type === "qsys") {
        // qsys.setString("1", json_to_send);
    }
}

async function send_as_chunks(
    id: string,
    json: string,
    delay: number,
    chunkSize = 255,
) {
    function wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const chunks = [];
    for (let i = 0; i < json.length; i += chunkSize) {
        chunks.push(json.slice(i, i + chunkSize));
    }
    crestron.setSerial(id, "CREATE_A_NEW_FILE_PLEASE");
    await wait(delay);
    crestron.setSerial(id, "");
    await wait(delay);

    for (const chunk of chunks) {
        crestron.setSerial(id, chunk);
        await wait(delay);
        // crestron.setSerial(id, "");
        // await wait(delay);
    }
}
