import './result.js'
import Wizard from '@violacaroline/wizard'

/**
 * The wind web component module.
 */
const template = document.createElement('template')
template.innerHTML = `
    <style>
      #container {
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
      }

      form {
        text-align: center;
      }
 
      h1 {
       font-size: 2em;
       color: #107dac;
      }

      select {
        width: 280px;
        display: block;
        margin: 5%;
        padding: 2%;
        text-align: center;
      }

      input {
        display: block;
        margin: 5% auto;
        padding: 2%;
        text-align: center;
      }

      button {
      background-color: #107dac;
      color: white;
      border: none;
      margin: 10px;
      padding: 10px;
      border-radius: 10px; 
    }

    button:hover {
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      cursor: pointer;
    }
  
    </style>
    <div id="container">      
      <form action="">
      <h1>Convert wind ...</h1>
        <input id="input-value" type="text" placeholder="Value" />
        <select name="units" id="unit-select-from">
            <option value="">--Please choose a unit to convert FROM--</option>
            <option value="kmh">Kilometer per hour</option>
            <option value="ms">Meter per second</option>
            <option value="fts">Feet per second</option>
            <option value="mph">Miles per hour</option>
            <option value="knots">Knots</option>
        </select>
        <select name="units" id="unit-select-to">
            <option value="">--Please choose a unit to convert TO--</option>
            <option value="kmh">Kilometer per hour</option>
            <option value="ms">Meter per second</option>
            <option value="fts">Feet per second</option>
            <option value="mph">Miles per hour</option>
            <option value="knots">Knots</option>
        </select>
        <button id="convert-btn">Convert!</button>
      </form>
    </div>
  `

customElements.define('wind-component',
  /**
   * Represents the wind element.
   */
  class extends HTMLElement {
    #container
    #convertBtn

    /**
     * The wizard doing the conversion.
     */
    #wizard = new Wizard()

    /**
      * Creates an instance of the current type.
      *
      */
    constructor() {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get necessary elements in shadowroot.
      this.#container = this.shadowRoot.querySelector('#container')
      this.#convertBtn = this.shadowRoot.querySelector('#convert-btn')
    }

    /**
      * Called when element is inserted to the DOM.
      *
      */
    connectedCallback () {
      this.#convertBtn.addEventListener('click', (event) => {
        event.preventDefault()
        this.removeAttribute('result')

        const options = this.createOptionsObject()

        this.tryConversion(options)
      })
    }

    /**
     * Called when element is removed from the DOM.
     */
    disconnectedCallback () {
      this.#container.querySelector('#unit-select-from').value = ''
      this.#container.querySelector('#unit-select-to').value = ''
      this.#container.querySelector('#input-value').value = ''
    }

    /**
     * Create options object.
     *
     * @return - An options object
     */
    createOptionsObject () {
      return {
        fromUnit: this.#container.querySelector('#unit-select-from').value,
        toUnit: this.#container.querySelector('#unit-select-to').value,
        value: this.#container.querySelector('#input-value').value
      }
    }

    /**
     * Try conversion.
     *
     * @param {object} options - The options object containing the values to convert.
     */
    tryConversion (options) {
      try {
        const convert = new window.CustomEvent('convert', {
          detail: this.#wizard.convertWind(options)
        })
        this.dispatchEvent(convert)
      } catch (error) {
        const conversionError = new window.CustomEvent('conversion-error', {
          detail: error.message
        })
        this.dispatchEvent(conversionError)
      }
    }
  }
)
