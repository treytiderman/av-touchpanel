import { Validator, type Schema } from "@cfworker/json-schema";
import av_touchpanel_schema from "../assets/av-touchpanel-schema.json";
import { xpConnect } from "./backend-crestron.svelte";

export {
    config,
    flat_to_nested_config,
    nested_to_flat_config,
    get_array_length_flat_config,
    remove_index_in_flat_obj,
};

const urlSearchParams = new URLSearchParams(window.location.search);
const schema_validator = new Validator(
    av_touchpanel_schema as unknown as Schema,
);

const config: {
    ready: boolean;
    server_connected: boolean;
    schema: typeof av_touchpanel_schema;
    active: Record<string, any>;
    working_flat: Record<string, any>;
    get_from_server: (uri: string) => Promise<any>;
    set: (new_config: any) => any;
    set_from_working: () => any;
    get_page_by_id: (page_id: string) => any;
    validate: (config: any) => any;
    connect_to_server: () => Promise<void>;
    url_params: {
        config_file: string;
        edit_mode: boolean;
        ip: string;
        ipid: string;
        roomid: string;
        token: string;
    };
} = $state({
    ready: false,
    server_connected: false,
    schema: av_touchpanel_schema,
    active: {},
    working_flat: {},
    get_from_server: get_config,
    set: set_config,
    set_from_working: set_from_working_flat_config,
    get_page_by_id: get_page_by_id,
    validate: validate_config,
    connect_to_server: connect_to_server,
    url_params: {
        config_file: urlSearchParams.get("config") || "",
        edit_mode: !!urlSearchParams.get("edit") || false,
        ip: urlSearchParams.get("ip") || location.hostname,
        ipid: urlSearchParams.get("ipid") || "0x03",
        roomid: urlSearchParams.get("roomid") || "1",
        token: urlSearchParams.get("token") || "",
    },
});

async function get_config(uri: string) {
    console.log("config: get from", uri);
    const options = { method: "GET" };
    let response = await fetch(uri, options);
    if (!response.ok) {
        return {};
    }
    try {
        let new_config = await response.json();
        config.set(new_config);
        config.ready = true;
    } catch (error) {
        return {};
    }
}

function set_config(new_config: any) {
    console.log("config: received", new_config);
    const check = validate_config(new_config);
    if (check.valid) {
        config.active = new_config;
        config.working_flat = nested_to_flat_config(new_config);
        on_config_change();
        return new_config;
    } else {
        console.error("config not valid", check);
        return {};
    }
}

function on_config_change() {
    document.documentElement.classList =
        `${config.active.client.theme || ""} ` +
        `rotate-${config.active.client.rotate || ""} `;
}

function set_from_working_flat_config() {
    return config.set(flat_to_nested_config(config.working_flat));
}

function get_page_by_id(page_id: string) {
    return config.active.page_list?.find(
        (page: { page_id: string }) => page.page_id === page_id,
    );
}

function validate_config(config: any) {
    return schema_validator.validate(config);
}

function flat_to_nested_config(flat_obj: any): any {
    const result: any = {};

    for (const [path, value] of Object.entries(flat_obj)) {
        const keys = path.split("/").filter((k) => k && k !== "#");
        let current = result;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            const nextKey = keys[i + 1];
            const isArrayIndex = /^\d+$/.test(nextKey);

            if (!current[key]) {
                current[key] = isArrayIndex ? [] : {};
            }
            current = current[key];
        }

        const lastKey = keys[keys.length - 1];
        if (value !== "" && value !== null && value !== undefined) {
            if (Array.isArray(current)) {
                current[parseInt(lastKey)] = value;
            } else {
                current[lastKey] = value;
            }
        }
    }

    function removeEmpty(obj: any): any {
        for (const key in obj) {
            if (typeof obj[key] === "object" && obj[key] !== null) {
                removeEmpty(obj[key]);
                if (Array.isArray(obj[key])) {
                    if (obj[key].length === 0) delete obj[key];
                } else if (Object.keys(obj[key]).length === 0) {
                    delete obj[key];
                }
            }
        }
        return obj;
    }

    return removeEmpty(result);
}

function nested_to_flat_config(nested_obj: any): any {
    const result: any = {};

    function flatten(obj: any, prefix: string = "") {
        for (const [key, value] of Object.entries(obj)) {
            const path = prefix ? `${prefix}/${key}` : `#/${key}`;

            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    const arrayPath = `${path}/${index}`;
                    if (typeof item === "object" && item !== null) {
                        flatten(item, arrayPath);
                    } else {
                        result[arrayPath] = item;
                    }
                });
            } else if (typeof value === "object" && value !== null) {
                flatten(value, path);
            } else {
                result[path] = value;
            }
        }
    }

    flatten(nested_obj);
    return result;
}

function get_array_length_flat_config(flat_obj: any, path: string) {
    const keys = path.split("/").filter((k) => k && k !== "#");
    let maxIndex = -1;

    for (const key of Object.keys(flat_obj)) {
        const keyParts = key.split("/").filter((k) => k && k !== "#");

        if (keyParts.length >= keys.length) {
            let matches = true;
            for (let i = 0; i < keys.length; i++) {
                if (keyParts[i] !== keys[i]) {
                    matches = false;
                    break;
                }
            }

            if (matches && /^\d+$/.test(keyParts[keys.length])) {
                const index = parseInt(keyParts[keys.length]);
                maxIndex = Math.max(maxIndex, index);
            }
        }
    }

    return maxIndex + 1;
}

function remove_index_in_flat_obj(flat_obj: any, path: string, index: number) {
    const prefixToRemove = `${path}/${index}`;
    const keysToUpdate: [string, string][] = [];

    for (const key of Object.keys(flat_obj)) {
        if (key === prefixToRemove || key.startsWith(`${prefixToRemove}/`)) {
            delete flat_obj[key];
        } else if (key.startsWith(`${path}/`)) {
            const suffix = key.substring(`${path}/`.length);
            const nextSegment = suffix.split("/")[0];
            const arrayIndex = parseInt(nextSegment);

            if (!isNaN(arrayIndex) && arrayIndex > index) {
                const newKey = key.replace(
                    `${path}/${arrayIndex}`,
                    `${path}/${arrayIndex - 1}`,
                );
                keysToUpdate.push([key, newKey]);
            }
        }
    }

    for (const [oldKey, newKey] of keysToUpdate) {
        flat_obj[newKey] = flat_obj[oldKey];
        delete flat_obj[oldKey];
    }

    return flat_obj;
}

async function connect_to_server() {
    if (config.active.server.backend === "crestron") {
        console.log("server: backend = crestron");
        const xp = await xpConnect(
            config.active.server.host,
            config.active.server.ipid,
            config.active.server.roomid,
            config.active.server.token
        );
        config.server_connected = xp.isConnected
    } else if (config.active.server.backend === "qsys") {
        // const xp = xpConnect(ip, ipid, roomid, token);
    } else {
        console.log("server: backend = offline");
        config.server_connected = true;
    }
}

const test_obj = {
    key: "string",
    arr: ["hello", "there", "blue", "stanger"],
    arr2: [{ key: "hello" }, { key: "there" }, { key: "stanger" }],
};

// console.log(nested_to_flat_config(test_obj));
// console.log(flat_to_nested_config(nested_to_flat_config(test_obj)));
// console.log(get_array_length_flat_config(nested_to_flat_config(test_obj), "#/arr"));
// console.log(get_array_length_flat_config(nested_to_flat_config(test_obj), "#/arr2"));

const test_flat_obj = `{
    "#/version": 0,
    "#/server/host": "192.168.1.9",
    "#/server/backend": "crestron",
    "#/server/backend_options/ipid": "0x03",
    "#/server/backend_options/roomid": "1",
    "#/server/backend_options/token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzMjhiYmMwLWFlYWYtNGI0OC05MGJjLTAwMmI4MjkwYmFlNCIsImx2IjoiRGVmYXVsdCBMZXZlbCIsInZlciI6IjEuMCIsImV4cGkiOiIwIn0.h6cUVnbGogzwcszdNawI4ffovCYYOoDX1hN4NudO7ys",
    "#/settings/theme": "auto",
    "#/settings/scale": 1.2,
    "#/settings/scale_small": 1,
    "#/settings/rotate": 0,
    "#/page_list/0": "",
    "#/page_list/1": "",
    "#/page_list/2": "",
    "#/page_list/3": ""
}`;

// console.log("flat_to_nested_config", flat_to_nested_config(test_flat_obj));
// console.log("remove_index_in_flat_obj", remove_index_in_flat_obj(test_flat_obj, "#/page_list", 1));
