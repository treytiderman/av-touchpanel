// Send query to server
export async function get(uri) {
  
  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}/api${uri}`;
  const options = {
    method: 'GET',
  };

  // Fetch
  let response = await fetch(url, options);
  if (!response.ok) { return }
  const res = await response.json();
  return res;

}

// Send query to server
export async function post(uri, data) {

  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}/api${uri}`;
  const options = {
    method: 'POST',
    body: JSON.stringify(data)
  };

  // Fetch
  let response = await fetch(url, options);
  if (!response.ok) { return }
  const res = await response.json();
  return res;

}

// Run the callback function if 1s has passed since the last time debounce() was called
export function debounce(cb, delay = 1000) {
  let timeout;  
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

// Run the callback function immediately and every 1s afterwards
// Example: A sliders value changes rapidly,
// so instead of running a function every small value change
// only run the function every 100ms (save on network traffic)
export function throttle(cb, delay = 100) {
  let shouldWait = false
  let waitingArgs
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false
    } else {
      cb(...waitingArgs)
      waitingArgs = null
      setTimeout(timeoutFunc, delay)
    }
  }
  return (...args) => {
    if (shouldWait) {
      waitingArgs = args
      return
    }
    cb(...args)
    shouldWait = true
    setTimeout(timeoutFunc, delay)
  }
}

// Get random number between min and max
export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Force to range
export function numMinMax(num, min, max){
  const MIN = min || 1;
  const MAX = max || 20;
  const parsed = parseInt(num)
  return Math.min(Math.max(parsed, MIN), MAX)
}