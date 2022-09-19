<!-- Javascript -->
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import Icon from './Icon.svelte'

  // Variables
  let timeout
  let clearTimeout_sec = 1
  let number = ""

  // Functions
  function printNumber(num) {
    let string =''
    for (let i = 0; i < num.length; i++) {
      const digit = num[i]
      if (i !== num.length-1) string += "•"
      else string += digit
    }
    return string
  }
  function numberPress(num) {
    if (number.length < 10) number += num
    dispatch('press', num)
    dispatch('number', number)
  }
  function enterPress() {
    dispatch('enter', number)
  }

  // Dynamic Variables
  $: numberString = printNumber(number)

</script>

<!-- HTML -->
<div class="wholeKeypad">

  <!-- Passcode -->
  <div class="number">
    <h2>{numberString}</h2>
    {#if number !== ""}      
      <button class="back"
        on:pointerup={ () => {
          clearTimeout(timeout)
          number = number.slice(0, -1)
        }}
        on:pointerdown={ () => {
          timeout = setTimeout(() => {
            number = ""
          }, clearTimeout_sec * 1000)
        }}
      >
        <Icon name="arrow_back" size=2/>
      </button>
    {/if}
  </div>
  
  <!-- Keypad -->
  <div class="grid3x3">
  
    <button on:click={() => numberPress('1')}> 
      <div>
        <span>1</span>
        <span></span>
      </div>
    </button>
    <button on:click={() => numberPress('2')}> 
      <div>
        <span>2</span>
        <span>ABC</span>
      </div>
    </button>
    <button on:click={() => numberPress('3')}> 
      <div>
        <span>3</span>
        <span>DEF</span>
      </div>
    </button>
  
    <button on:click={() => numberPress('4')}> 
      <div>
        <span>4</span>
        <span>GHI</span>
      </div>
    </button>
    <button on:click={() => numberPress('5')}> 
      <div>
        <span>5</span>
        <span>JKL</span>
      </div>
    </button>
    <button on:click={() => numberPress('6')}> 
      <div>
        <span>6</span>
        <span>MNO</span>
      </div>
    </button>
  
    <button on:click={() => numberPress('7')}> 
      <div>
        <span>7</span>
        <span>PQRS</span>
      </div>
    </button>
    <button on:click={() => numberPress('8')}> 
      <div>
        <span>8</span>
        <span>TUV</span>
      </div>
    </button>
    <button on:click={() => numberPress('9')}> 
      <div>
        <span>9</span>
        <span>WXYZ</span>
      </div>
    </button>
    
    <button on:click={() => numberPress('0')}> 
      <div>
        <span>0</span>
        <span></span>
      </div>
    </button>
    <button class="enter" on:click={enterPress}>
      <Icon name="check"/>
    </button>
  
  </div>
</div>

<!-- CSS -->
<style>
  .wholeKeypad {
    display: grid;
    gap: var(--gap);
    align-items: flex-start;
  }
  
  .number {
    display: flex;
    align-items: center;
    padding: 0;
    height: 1.8rem;
  }
  .back {
    padding: 0;
    font-size: 1rem;
    background-color: transparent;
    /* color: var(--color-font-0); */
  }
  h2 {
    padding: 0;
    color: var(--color-text-bright);
    font-family: var(--font-mono);
    margin-right: auto;
  }

  .grid3x3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap);
    /* border: var(--border); border-color: red; */
  }
  .grid3x3 > button {
    --size: 5rem;
    height: var(--size);
    width: var(--size);
    font-size: 2rem;
    padding: 0;
    display: grid;
    place-items: center;
    background-color: var(--color-bg-secondary);
    /* border: var(--border); border-color: red; */
  }
  button > div {
    display: grid;
    gap: .25rem;
  }
  span:nth-child(2) {
    font-size: 1rem;
    color: var(--color-text-dim);
  }
  button:nth-child(10) {
    grid-column: span 2;
    width: 100%;
  }

  .grid3x3 > button.enter {
    color: var(--color-text-green);
    background-color: var(--color-bg-green);
  }
</style>