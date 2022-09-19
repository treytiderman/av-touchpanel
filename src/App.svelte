<!-- Javascript -->
<script>

  // Stores
  import { global, router, config, getJSON, getConfigFileName, getUrlSearchs, getUrlHash } from './js/global.js'
  import { ws, setDebug } from './js/simpl-ws'

  // Load Config File
  import { onMount } from 'svelte';
  onMount(async () => {
    $config = await getJSON(getConfigFileName())
    $router = {
      page: $config.client.startup.page,
      popup: $config.client.startup.popup,
      subpage: $config.client.startup.subpage
    }
    $global = {
      screen: {
        width: document.documentElement.offsetWidth,
        height: document.documentElement.offsetHeight,
        portrait: document.documentElement.offsetWidth < document.documentElement.offsetHeight
      },
      url: {
        search: getUrlSearchs(),
        hash: getUrlHash(),
      },
    }
    
    // Screen Resize
    window.addEventListener('resize', event => {
      $global.screen = {
        width: document.documentElement.offsetWidth,
        height: document.documentElement.offsetHeight,
        portrait: document.documentElement.offsetWidth < document.documentElement.offsetHeight
      }
    })
    
    // Start Websocket
    if ($config.server.online) {
      setDebug(true)
      ws.connect({ 
        ip: $config.server.ip,
        port: $config.server.websocket.port,
        path: $config.server.websocket.path,
      })
    }

    // Handle History
    let lastPage
    router.subscribe(obj => {
      if (lastPage !== obj.page) {
        const state = {}
        const label = ""
        // const url = obj.page + document.location.search + document.location.hash
        const url = document.location.search + "#" + obj.page
        history.pushState(state, label, url)
      }
      lastPage = obj.page
    })
    window.addEventListener('popstate', event => {
      if ($router.popup !== "") $router.popup = ""
      else { 
        // const url = $router.page + document.location.search + document.location.hash
        const url = document.location.search + "#" + $router.page
        const currentUrl = event.target.location.pathname.substring(1)
        if (currentUrl !== $router.page) history.pushState({}, "", url)
        $router.page = $config.client.startup.page
      }
    })

  })

  // Theme
  import "./themes/theme-dark.css"
  import "./themes/theme-light.css"
  import "./themes/theme-test.css"
  
  // Components
  import TopBar from "./layout/TopBar.svelte"
  import Main from "./layout/Main.svelte"
  import Popup from "./layout/Popup.svelte"

  // Pages
  const pageFiles = {
    "SplashPage": {
      file: "SplashPage",
      component: () => import("./pages/SplashPage.svelte")
    },
    "ActivityPage": {
      file: "ActivityPage",
      component: () => import("./pages/ActivityPage.svelte")
    },
    "VideoPage": {
      file: "VideoPage",
      component: () => import("./pages/VideoPage.svelte")
    },
    "AudioPage": {
      file: "AudioPage",
      component: () => import("./pages/AudioPage.svelte")
    },
    "CameraPage": {
      file: "CameraPage",
      component: () => import("./pages/CameraPage.svelte")
    },
    "PhonePage": {
      file: "PhonePage",
      component: () => import("./pages/PhonePage.svelte")
    },
    "DevicePowerPage": {
      file: "DevicePowerPage",
      component: () => import("./pages/DevicePowerPage.svelte")
    },
    "SystemOffPage": {
      file: "SystemOffPage",
      component: () => import("./pages/SystemOffPage.svelte")
    },
    "PasscodePage": {
      file: "PasscodePage",
      component: () => import("./pages/PasscodePage.svelte")
    },
    "WallsPage": {
      file: "WallsPage",
      component: () => import("./pages/WallsPage.svelte")
    },
    "ConfigPage": {
      file: "ConfigPage",
      component: () => import("./pages/ConfigPage.svelte")
    },
    "UrlEmbedPage": {
      file: "UrlEmbedPage",
      component: () => import("./pages/UrlEmbedPage.svelte")
    },
    "MissingPage": {
      file: "MissingPage",
      component: () => import("./pages/MissingPage.svelte")
    }
  }
  
  // Connecting to server...
  let dots = "."
  setInterval(() => dots.length > 5 ? dots = "." : dots += ".", 500);

  // Dynamic css classes
  $: document.querySelector("body").classList = $config.client?.theme || "dark"
  $: document.documentElement.classList = `rotate${$config.client?.rotate}` || ""
  $: document.documentElement.style.fontSize = $global.screen?.width < 550 ? `${$config.client?.scaleMobile*14}px` || "14px" : `${$config.client?.scale*20}px` || "20px"

  // Debug
  $: $router?.page ? console.log("router", $router) : ""
  $: $global?.url ? console.log("global", $global) : ""

</script>

<!-- Don't render untill the config file is found and websocket is connected -->
{#if $config?.pages && (!$config.server.online || $ws.status === "open")}

  <!-- Redraw if any of the router properties change -->
  {#key $router}
    <TopBar config={$config.topBar} />
    <Main 
      pageFiles={pageFiles}
      activePageFile={pageFiles[$config.pages[$router.page]?.file] || pageFiles["MissingPage"]}
      activePageConfig={$config.pages[$router.page]}
    />
    {#if $router.popup !== ""}
      <Popup 
        pageFiles={pageFiles}
        activePopupFile={pageFiles[$config.pages[$router.popup]?.file] || pageFiles["MissingPage"]}
        activePopupConfig={$config.pages[$router.popup]}
      />
    {/if}
  {/key}

<!-- Websocket failed to connect  -->
{:else}

  <div style="padding: 3rem; display: grid; gap: 2rem">
    <h4>Connecting to server{dots}</h4>
    <div>
      <button style="background-color: var(--color-bg-secondary);"
        on:click={() => location.reload()}
      >Reload?</button>
    </div>
  </div>

{/if}