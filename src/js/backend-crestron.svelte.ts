import { getWebXPanel, runsInContainerApp } from "@crestron/ch5-webxpanel";
const { isActive, WebXPanel, WebXPanelConfigParams, WebXPanelEvents } =
    getWebXPanel(!runsInContainerApp());

export { xpConnect };

const xp = $state({
    isConnected: false,
    status: "INIT",
    host: "",
    ipId: "",
    roomId: "",
});

async function xpConnect(
    host: string,
    ipId: string,
    roomId: string,
    authToken: string,
): Promise<typeof xp> {
    const config: Partial<typeof WebXPanelConfigParams> = {
        host: host,
        ipId: ipId,
        roomId: roomId,
        authToken: authToken,
    };

    if (isActive) WebXPanel.initialize(config);
    xp.host = host;
    xp.ipId = ipId;
    xp.roomId = roomId;

    return new Promise((resolve, reject) => {
        WebXPanel.addEventListener(
            WebXPanelEvents.CONNECT_WS,
            ({ detail }: any) => {
                console.log("crestron xpanel: CONNECT_WS", detail);
                xp.status = "CONNECT_WS";
            },
        );

        WebXPanel.addEventListener(
            WebXPanelEvents.DISCONNECT_WS,
            ({ detail }: any) => {
                console.log("crestron xpanel: DISCONNECT_WS", detail);
                xp.status = `DISCONNECT_WS try https://${xp.host}:49200/ then come back`;
            },
        );

        WebXPanel.addEventListener(
            WebXPanelEvents.ERROR_WS,
            ({ detail }: any) => {
                console.log("crestron xpanel: ERROR_WS", detail);
                xp.status = "ERROR_WS";
            },
        );

        WebXPanel.addEventListener(
            WebXPanelEvents.WEB_WORKER_FAILED,
            ({ detail }: any) => {
                console.log("crestron xpanel: WEB_WORKER_FAILED", detail);
                xp.status = "WEB_WORKER_FAILED";
            },
        );

        WebXPanel.addEventListener(
            WebXPanelEvents.CONNECT_CIP,
            ({ detail }: any) => {
                console.log("crestron xpanel: CONNECT_CIP", detail);
                xp.status = "CONNECT_CIP";
                xp.isConnected = true;
                resolve(xp);
            },
        );

        WebXPanel.addEventListener(
            WebXPanelEvents.DISCONNECT_CIP,
            ({ detail }: any) => {
                console.log("crestron xpanel: DISCONNECT_CIP", detail);
                xp.status = "DISCONNECT_CIP";
                resolve(xp);
            },
        );

        WebXPanel.addEventListener(
            WebXPanelEvents.AUTHENTICATION_FAILED,
            ({ detail }: any) => {
                console.log("crestron xpanel: AUTHENTICATION_FAILED", detail);
                xp.status = "AUTHENTICATION_FAILED";
            },
        );

        WebXPanel.addEventListener(
            WebXPanelEvents.AUTHENTICATION_REQUIRED,
            ({ detail }: any) => {
                console.log("crestron xpanel: AUTHENTICATION_REQUIRED", detail);
                xp.status = "AUTHENTICATION_REQUIRED";
            },
        );

        WebXPanel.addEventListener(
            WebXPanelEvents.NOT_AUTHORIZED,
            ({ detail }: any) => {
                console.log("crestron xpanel: NOT_AUTHORIZED", detail);
                xp.status = "NOT_AUTHORIZED";
            },
        );
    });
}
