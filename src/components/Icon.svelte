<!-- Examples
<Icon name="add_circle-fill" color='red'/>
<Icon svgPath="/svgs/font_awesome/comment.svg" size=2 />
<Icon imagePath="/images/Yo.png" />
<Icon imagePath="/images/FordAV_BlackBG_1920_1080.png" width=4 height=2.25 />
-->

<!-- Javascript -->
<script>

  // Exports
  export let size = 1
  export let width = undefined
  export let height = undefined
  export let color = "currentColor"
  export let inline = false

  // SVG
  export let svgPath = undefined
  export let name = undefined // same as material_symbols
  let svgUsed = svgPath || name
  // If "name" prop was used update the svgPath
  if (name) svgPath = `./svgs/material_symbols/${name.toLowerCase()}`
  // If "name" prop is the svgPath
  if (name && name.startsWith("/")) svgPath = name
  // Add ".svg" to the end of the svgPath is it isn't there already
  if (svgUsed && !svgPath.endsWith(".svg")) svgPath += ".svg"
  
  // Image
  export let imagePath = undefined
  let imageUsed = imagePath

</script>

<!-- SVG -->
{#if svgUsed}
<div style="{$$props.style}" class="{ inline ? "inline" : ""}">
  <img
    src={svgPath}
    alt="SVG Icon"
    onload="SVGInject(this)"
    style="
      width: {width ?? size}em;
      height: {height ?? size}em;
      fill: {color};
      shape-rendering: optimizeSpeed;
      shape-rendering: geometricPrecision;
    "
  >
</div>
<!-- Image | .png .jpeg .gif .jpg .ico .cur .apng -->
{:else if imageUsed}
  <img 
    src={imagePath}
    alt="SVG Icon"
    style="
      width: {width ?? size}em;
      height: {height ?? size}em;
      display: block;
      object-fit: contain;
      {$$props.style}
    "
  >
{/if}

<style>
  div {
    display: grid;
    place-items: center;
  }
  div.inline {
    display: inline;
  }
</style>