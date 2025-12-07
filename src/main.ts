import { mount } from 'svelte'
import './css/styles.css'
import './css/theme-black.css'
import './css/theme-dark.css'
import './css/theme-light.css'
import App from './App.svelte'

const app = mount(App, {
    target: document.getElementById('app')!,
})

export default app
