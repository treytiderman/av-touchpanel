<!-- Javascript -->
<script>

  // Stores + Functions
  import { global, router, config, getJSON, getConfigFileName, getUrlSearchs, getUrlHash } from './js/global.js'
  let lastPage = "last"
  // Load Config File
  import { onMount } from 'svelte';
  onMount(async () => {
		$config = await getJSON(getConfigFileName())
    $router = {
      page: $config.startup.page,
      popup: $config.startup.popup,
      subpage: $config.startup.subpage
    }
    $global = {
      advancedRouting: false,
      privacyMute: $config.privacyMute,
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

    // Handle History
    router.subscribe(obj => {
      if (lastPage !== obj.page) {
        const state = {}
        const label = ""
        const url = obj.page + document.location.search + document.location.hash
        history.pushState(state, label, url)
      }
      lastPage = obj.page
    })
    window.addEventListener('popstate', event => {
      if ($router.popup !== "") $router.popup = ""
      else { 
        const url = $router.page + document.location.search + document.location.hash
        const currentUrl = event.target.location.pathname.substring(1)
        if(currentUrl !== $router.page) history.pushState({}, "", url)
        $router.page = $config.startup.page
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
    "ActivityPage": {
      file: "ActivityPage",
      component: () => import("./pages/ActivityPage.svelte")
    },
    "SplashPage": {
      file: "SplashPage",
      component: () => import("./pages/SplashPage.svelte")
    },
    "PresentationPage": {
      file: "PresentationPage",
      component: () => import("./pages/PresentationPage.svelte")
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
    "PowerDownPage": {
      file: "PowerDownPage",
      component: () => import("./pages/PowerDownPage.svelte")
    },
    "AudioPage": {
      file: "AudioPage",
      component: () => import("./pages/AudioPage.svelte")
    },
    "ConfigPage": {
      file: "ConfigPage",
      component: () => import("./pages/ConfigPage.svelte")
    },
    "MissingPage": {
      file: "MissingPage",
      component: () => import("./pages/MissingPage.svelte")
    }
  }

  // Dynamic css classes
  $: document.querySelector("body").classList = $config?.theme || "dark"
  $: document.documentElement.classList = `rotate${$config?.rotate}` || ""
  $: document.documentElement.style.fontSize = $global.screen?.width < 550 ? `${$config.scaleMobile*14}px` || "14px" : `${$config.scale*20}px` || "20px"

  // Debug
  $: $config?.pages ? console.log("config", $config) : ""
  $: $router?.page ? console.log("router", $router) : ""
  $: $global?.url ? console.log("global", $global) : ""

</script>

<!-- Don't render untill the config file is found -->
{#if $config?.pages}

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

{/if}
