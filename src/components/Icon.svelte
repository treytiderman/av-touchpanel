<!-- Javascript -->
<script>
  export let fill = true
  export let name = "star"
  export let size = 1
</script>

<!-- HTML -->
<i 
  class="icon {fill ? "fill" : ""}" 
  style={`font-size: ${size}em; ${$$props.style}`}
>
  {name}
</i>

<!-- CSS -->
<style>
  i {
    vertical-align: -4px;
  }
</style>