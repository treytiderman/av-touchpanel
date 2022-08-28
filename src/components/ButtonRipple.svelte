<!-- Javascript -->
<script>
  let ms = 500;
  let show = false;
  export function press() {
    show = false
    setTimeout(() => show = true, 1)
  }
</script>

<!-- HTML -->
<button on:click class={`${$$props.class}`}>
  <slot/>
  {#if show}
    <span style="animation-duration: {ms}ms;"/>
  {/if}
</button>

<!-- CSS -->
<style>
  button {
    /* Style */
    border-radius: var(--radius);
    padding: var(--padding);
    box-shadow: var(--shadow);
    color: var(--color-text-secondary);
    background-color: var(--color-bg-secondary);
    
    /* For animation */
    -webkit-tap-highlight-color: transparent;
    position: relative;
    overflow: hidden;
  }
  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: press 1s;
    background-color: transparent;
  }
  @keyframes press {
    0% {
      background-color: black;
      opacity: .4;
    }
    100% { 
      background-color: transparent;
    }
  }
</style>