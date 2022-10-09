<!-- Script -->
<script>
  export let show = false
  export let delayTime = 250
  let timeout
  let delayTrue = false
  setTimeout(() => delayTrue = true, delayTime)
  $: loadingShow = show && delayTrue
</script>

<!-- HTML -->
{#if loadingShow}
  <div 
    on:pointerup={() => clearTimeout(timeout)}
    on:pointerdown={() => timeout = setTimeout(() => location.reload(true), 1000)}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/></svg>
  </div>
{/if}

<!-- CSS -->
<style>
  div {
    z-index: 98;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    padding: 7rem;
    opacity: 0.25;
    display: flex;
    justify-content: center;
  }
  svg {
    fill: grey;
    animation-name: spin;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  @keyframes spin {
    from {
      transform:rotate(0deg);
    }
    to {
      transform:rotate(360deg);
    }
  }
</style>