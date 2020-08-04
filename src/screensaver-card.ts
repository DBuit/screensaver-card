import { LitElement, html, css } from 'lit-element';
import { hass, provideHass } from "card-tools/src/hass";
import moment from 'moment/min/moment-with-locales';
import {
  getLovelace
} from 'custom-card-helpers';

class ScreensaverCard extends LitElement {
  config: any;
  hass: any;
  shadowRoot: any;
  renderCard: any;
  clock = false;
  digitalClock = false;
  twelveHourVersion = false;
  digitalClockWithSeconds = false;
  date = false;
  dateFormat = "DD MMMM";

  static get properties() {
    return {
      hass: {},
      config: {},
      active: {}
    };
  }
  
  constructor() {
    super();
  }
  
  render() {
    const title = "title" in this.config ? this.config.title : false;
    this.clock = this.config.clock ? this.config.clock : false;
    this.digitalClock = this.config.digitalClock ? this.config.digitalClock : false;
    this.digitalClockWithSeconds = this.config.digitalClockWithSeconds ? this.config.digitalClockWithSeconds : false;
    this.twelveHourVersion = this.config.twelveHourVersion ? this.config.twelveHourVersion : false;
    this.date = this.config.date ? this.config.date : false;
    this.dateFormat = this.config.dateFormat ? this.config.dateFormat : "DD MMMM";
    return html`
      <div class="screensaver">
        ${this.digitalClock ? html`<h1 class="digitalClock${title ? ' with-title':''}${this.digitalClockWithSeconds ? ' with-seconds' : ''}"></h1>`: html``}
        ${this.clock ? html`
          <div class="clock">
            <div class="wrap">
              <span class="hour"></span>
              <span class="minute"></span>
              <span class="second"></span>
              <span class="dot"></span>
            </div>
          </div>
        ` : html``}
        ${title ? html`<h1>${title}</h1>`: html``}
        ${this.date ? html`
          <h2 class="date"></h2>
        ` : html`` }
      </div>
    `;
  }

  _runClock() {
    const date = new Date();
  
    var fullhours = date.getHours().toString();
    const hours = ((date.getHours() + 11) % 12 + 1);
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    const hour = Math.floor((hours * 60 + minutes) / 2);
    const minute = minutes * 6;
    const second = seconds * 6;
    
    if(this.clock) {
      this.shadowRoot.querySelector('.hour').style.transform = `rotate(${hour}deg)`
      this.shadowRoot.querySelector('.minute').style.transform = `rotate(${minute}deg)`
      this.shadowRoot.querySelector('.second').style.transform = `rotate(${second}deg)`
    }
    if(this.digitalClock && !this.twelveHourVersion) {
      const minutesString = minutes.toString();
      var digitalTime = fullhours.length < 2 ? '0' + fullhours + ':' : fullhours + ':';
      if(this.digitalClockWithSeconds) { 
        digitalTime += minutesString.length < 2 ? '0' + minutesString + ':' : minutesString + ':';
        const secondsString = seconds.toString();
        digitalTime += secondsString.length < 2 ? '0' + secondsString : secondsString
      } else {
        digitalTime += minutesString.length < 2 ? '0' + minutesString : minutesString;
      }
      this.shadowRoot.querySelector('.digitalClock').textContent = digitalTime;
    } else if(this.digitalClock && this.twelveHourVersion) {
      var ampm = hours >= 12 ? 'pm' : 'am';
      var hoursampm = date.getHours();
      hoursampm = hoursampm % 12;
      hoursampm = hoursampm ? hoursampm : 12; 
      fullhours = hoursampm.toString();
      const minutesString = minutes.toString();
      var digitalTime = fullhours.length < 2 ? '0' + fullhours + ':' : fullhours + ':';
      if(this.digitalClockWithSeconds) { 
        digitalTime += minutesString.length < 2 ? '0' + minutesString + ':' : minutesString + ':';
        const secondsString = seconds.toString();
        digitalTime += secondsString.length < 2 ? '0' + secondsString : secondsString
      } else {
        digitalTime += minutesString.length < 2 ? '0' + minutesString : minutesString;
      }
      digitalTime += ' ' + ampm;
      this.shadowRoot.querySelector('.digitalClock').textContent = digitalTime;


    }
  }
  _runDate() {
    const now = moment();
    now.locale(this.hass.language);
    const date = now.format(this.dateFormat);
    this.shadowRoot.querySelector('.date').textContent = date;
  }

  
  firstUpdated() {
    provideHass(this);

    const self = this;
    if(this.clock || this.digitalClock) {
      const inc = 1000;
      self._runClock();
      setInterval(function () {
        self._runClock();
      }, inc);
    }
    if(this.date) {
      const inc = 1000 * 60 * 60;
      self._runDate();
      setInterval(function () {
        self._runDate();
      }, inc);
    }
    
  }

  
  
  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
  
  static get styles() {
    return css`
        :host {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          // --face-color: #FFF;
          // --face-border-color: #FFF;
          // --clock-hands-color: #000;
          // --clock-seconds-hand-color: #FF4B3E;
          // --clock-middle-background: #FFF;
          // --clock-middle-border: #000;
          // --sidebar-background: #FFF;
          // --sidebar-text-color: #000;
          background-color: var(--sidebar-background, #FFF);
        }
        
        h1 {
          margin-top:0;
          margin-bottom: 20px;
          font-size: 32px;
          line-height: 32px;
          font-weight: 200;
          color: var(--sidebar-text-color, #000);
        }
        h1.digitalClock {
          font-size:60px;
          line-height: 60px;
        }
        h1.digitalClock.with-seconds {
          font-size: 48px;
          line-height:48px;
        }
        h1.digitalClock.with-title {
          margin-bottom:0;
        }
        h2 {
          margin:0;
          font-size: 26px;
          line-height: 26px;
          font-weight: 200;
          color: var(--sidebar-text-color, #000);
        }

        .clock {
          margin:20px 0;
          position:relative;
          padding-top: calc(100% - 10px);
          width: calc(100% - 10px);
          border-radius: 100%;
          background: var(--face-color, #FFF);
          font-family: "Montserrat";
          border: 5px solid var(--face-border-color, #FFF);
          box-shadow: inset 2px 3px 8px 0 rgba(0, 0, 0, 0.1);
        }
        
        .clock .wrap {
          overflow: hidden;
          position: absolute;
          top:0;
          left:0;
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
        
        .clock .minute,
        .clock .hour {
          position: absolute;
          height: 28%;
          width: 6px;
          margin: auto;
          top: -27%;
          left: 0;
          bottom: 0;
          right: 0;
          background: var(--clock-hands-color, #000);
          transform-origin: bottom center;
          transform: rotate(0deg);
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
          z-index: 1;
        }
        
        .clock .minute {
          position: absolute;
          height: 41%;
          width: 4px;
          top: -38%;
          left: 0;
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
          transform: rotate(90deg);
        }
        
        .clock .second {
          position: absolute;
          top: -48%;
          height: 48%;
          width: 2px;
          margin: auto;
          left: 0;
          bottom: 0;
          right: 0;
          border-radius: 4px;
          background: var(--clock-seconds-hand-color, #FF4B3E);
          transform-origin: bottom center;
          transform: rotate(180deg);
          z-index: 1;
        }
        
        .clock .dot {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 12px;
          height: 12px;
          border-radius: 100px;
          background: var(--clock-middle-background, #FFF);
          border: 2px solid var(--clock-middle-border, #000);
          border-radius: 100px;
          margin: auto;
          z-index: 1;
        }
    `;
  }  
  
}

customElements.define('screensaver-card', ScreensaverCard);


function getRoot() {
    let root: any = document.querySelector('home-assistant');
    root = root && root.shadowRoot;
    root = root && root.querySelector('home-assistant-main');
    root = root && root.shadowRoot;
    root = root && root.querySelector('app-drawer-layout partial-panel-resolver');
    root = root && root.shadowRoot || root;
    root = root && root.querySelector('ha-panel-lovelace');
    root = root && root.shadowRoot;
    root = root && root.querySelector('hui-root');
    return root;
}


async function buildCard(contentContainer, config) {
  const screensaverCard = document.createElement("screensaver-card") as ScreensaverCard;
  screensaverCard.setConfig(config);
  screensaverCard.hass = hass();

  contentContainer.parentNode.insertBefore(screensaverCard, contentContainer);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getConfig() {
  let lovelace: any;
  while(!lovelace) {
    lovelace = getLovelace();
    if(!lovelace) {
      await sleep(500);
    }
  }

  return lovelace;
}

async function addScreensaver() {
  let lovelace = await getConfig();
  if(lovelace.config.screensaver) {
    const screensaverConfig = Object.assign({}, lovelace.config.screensaver);
      let root = getRoot();
      let appLayout = root.shadowRoot.querySelector('ha-app-layout');
      let contentContainer:any = appLayout.shadowRoot.querySelector('#contentContainer');
      await buildCard(contentContainer, screensaverConfig);
  } else {
    console.log('No Screensaver in config found!');
  }
}

addScreensaver();
