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
        let url = document.location.search + "#" + obj.page
        // history.pushState(state, label, url)
        history.pushState(state, label, "")
      }
      lastPage = obj.page
    })
    window.addEventListener('popstate', event => {
      if ($router.popup !== "") $router.popup = ""
      else { 
        // const url = $router.page + document.location.search + document.location.hash
        let url = document.location.search + "#" + $router.page
        const currentUrl = event.target.location.pathname.substring(1)
        // if (currentUrl !== $router.page) history.pushState({}, "", url)
        if (currentUrl !== $router.page) history.pushState({}, "", "")
        $router.page = $config.client.startup.page
      }
    })

    // Inactivity Timeout
    let idleTimeout
    const idleDuration_min = $config.client.blackout_min ?? 5
    const resetIdleTimeout = () => {
      if (idleTimeout) clearTimeout(idleTimeout) // Clears the existing timeout
      idleTimeout = setTimeout(() => {
        console.log(`Blackout triggered after ${idleDuration_min} minute(s) of inactivity`);
        blackout = true
      }, idleDuration_min * 60 * 1000);
    };
    if ($config.client?.blackout_min && $config.client.blackout_min > 0) {      
      // Init on page load
      resetIdleTimeout();
      // Reset the idle timeout on any of the events listed below
      ['click', 'touchstart', 'mousemove'].forEach(evt => 
        document.addEventListener(evt, resetIdleTimeout, false)
      );
    }
  })

  // Theme
  import "./themes/theme-dark.css"
  import "./themes/theme-light.css"
  import "./themes/theme-test.css"
  
  // Components
  import TopBar from "./layout/TopBar.svelte"
  import Main from "./layout/Main.svelte"
  import Popup from "./layout/Popup.svelte"
  import { fade } from 'svelte/transition';

  // Pages
  const pageFiles = {
    "ActivityPage": {
      file: "ActivityPage",
      component: () => import("./pages/ActivityPage.svelte")
    },
    "AudioPage": {
      file: "AudioPage",
      component: () => import("./pages/AudioPage.svelte")
    },
    "CameraPage": {
      file: "CameraPage",
      component: () => import("./pages/CameraPage.svelte")
    },
    "ConfigPage": {
      file: "ConfigPage",
      component: () => import("./pages/ConfigPage.svelte")
    },
    "EmbedPage": {
      file: "EmbedPage",
      component: () => import("./pages/EmbedPage.svelte")
    },
    "MissingPage": {
      file: "MissingPage",
      component: () => import("./pages/MissingPage.svelte")
    },
    "PasscodePage": {
      file: "PasscodePage",
      component: () => import("./pages/PasscodePage.svelte")
    },
    "PhonePage": {
      file: "PhonePage",
      component: () => import("./pages/PhonePage.svelte")
    },
    "QRCodePage": {
      file: "QRCodePage",
      component: () => import("./pages/QRCodePage.svelte")
    },
    "SplashPage": {
      file: "SplashPage",
      component: () => import("./pages/SplashPage.svelte")
    },
    "StreamPage": {
      file: "StreamPage",
      component: () => import("./pages/StreamPage.svelte")
    },
    "SystemOffPage": {
      file: "SystemOffPage",
      component: () => import("./pages/SystemOffPage.svelte")
    },
    "TogglePage": {
      file: "TogglePage",
      component: () => import("./pages/TogglePage.svelte")
    },
    "VideoPage": {
      file: "VideoPage",
      component: () => import("./pages/VideoPage.svelte")
    },
    "WallsPage": {
      file: "WallsPage",
      component: () => import("./pages/WallsPage.svelte")
    },
  }
  
  // Connecting to server...
  let dots = "."
  setInterval(() => dots.length > 5 ? dots = "." : dots += ".", 500);
  let timePassed = false;
  const fadeTime = 1000
  setTimeout(() => timePassed = true, fadeTime);

  // Dynamic css classes
  $: document.querySelector("body").classList = $config.client?.theme || "dark"
  $: document.documentElement.classList = `rotate${$config.client?.rotate}` || ""
  $: document.documentElement.style.fontSize = $global.screen?.width < 550 ? `${$config.client?.scaleMobile*14}px` || "14px" : `${$config.client?.scale*20}px` || "20px"
  
  // Redraw / Render conditions
  $: renderReady = $config?.pages && (!$config.server.online || $ws.status === "open")
  $: timePassed = $ws.status !== "open"
  let blackout = false
  let page = $router.page
  let popup = $router.popup
  router.subscribe(router => {
    if (page !== router.page) page = router.page
    if (popup !== router.popup) popup = router.popup
  })

  // Debug
  $: $router?.page ? console.log("router", $router) : ""
  $: $global?.url ? console.log("global", $global) : ""

</script>

<!-- Blackout -->
{#if blackout}  
  <div 
    on:click={() => blackout = false}
    style="
      z-index: 99;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: black;
    "
  >
  </div>
{/if}

<!-- Don't render untill the config file is found and websocket is connected -->
{#if renderReady}
  {#key $config}
    <div class="body" in:fade={{duration: timePassed ? 0 : fadeTime}} >
      {#if popup !== ""}
        <Popup 
          pageFiles={pageFiles}
          activePopupFile={pageFiles[$config.pages[popup]?.file] || pageFiles["MissingPage"]}
          activePopupConfig={$config.pages[popup]}
        />
      {/if}
      <TopBar config={$config.topBar}/>
      <Main 
        pageFiles={pageFiles}
        activePageFile={pageFiles[$config.pages[page]?.file] || pageFiles["MissingPage"]}
        activePageConfig={$config.pages[page]}
      />
    </div>
  {/key}

<!-- Config / Websocket failed to connect  -->
{:else if timePassed}
  <div style="padding: 3rem; display: grid; gap: 2rem">
    <h4>Connecting to server{dots}</h4>
    <div>
      <button style="background-color: var(--color-bg-secondary);"
        on:click={() => location.reload(true)}
      >Reload?</button>
    </div>
  </div>
{/if}