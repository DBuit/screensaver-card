import { LitElement, html, css } from 'lit-element';
import { hass, provideHass } from "card-tools/src/hass";
import { deviceID } from "card-tools/src/deviceId";
import moment from 'moment/min/moment-with-locales';
import {
  getLovelace
} from 'custom-card-helpers';

class ScreensaverCard extends LitElement {
  config: any;
  hass: any;
  shadowRoot: any;
  renderCard: any;
  digitalClock = false;
  twelveHourVersion = false;
  digitalClockWithSeconds = false;
  date = false;
  dateFormat = "DD MMMM";
  screenSaverRunning = false;
  time = 10;
  idleTime = 0;
  clockInterval: any;
  dateInterval: any;
  oldURL: any;
  currentURL: any;
  tempDisable = false;

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
    this.digitalClock = this.config.digitalClock ? this.config.digitalClock : false;
    this.digitalClockWithSeconds = this.config.digitalClockWithSeconds ? this.config.digitalClockWithSeconds : false;
    this.twelveHourVersion = this.config.twelveHourVersion ? this.config.twelveHourVersion : false;
    this.date = this.config.date ? this.config.date : false;
    this.dateFormat = this.config.dateFormat ? this.config.dateFormat : "DD MMMM";
    this.time = 'time' in this.config ? this.config.time : 10;
    return html`
      <div class="screensaver">
        ${this.digitalClock ? html`<h1 class="digitalClock${this.digitalClockWithSeconds ? ' with-seconds' : ''}"></h1>`: html``}
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
    this.classList.add('hide');
    provideHass(this);

    window.setInterval(() => {
      if (!this.screenSaverRunning) {
        this.idleTime++;
    
        if (this.idleTime >= this.time) {
          this.startScreenSaver();
        }
      }
    }, 1000);

    window.addEventListener('click', e => {
      this.idleTime = 0;
    
      if (this.screenSaverRunning) {
        e.preventDefault();
        this.stopScreenSaver();
      }
    });
    
    window.addEventListener('touchstart', e => {
      this.idleTime = 0;
    
      if (this.screenSaverRunning) {
        e.preventDefault();
        this.stopScreenSaver();
      }
    });

    if("hideOnPath" in this.config) {
      window.addEventListener("location-changed", () => {
        if( this.config.hideOnPath.includes(window.location.pathname)) {
          console.log('Screensaver disable for this path');
          this.tempDisable = true;
          this.stopScreenSaver();
        } else {
          this.tempDisable = false;
        }
      });
    }
  }

  stopScreenSaver() {
    clearInterval(this.clockInterval);
    clearInterval(this.dateInterval);
    this.screenSaverRunning = false;
    this.classList.add('hide');
  }

  startScreenSaver() {
    if(!this.tempDisable) {
      this.screenSaverRunning = true;

      const self = this;
      if(this.digitalClock) {
        self._runClock();
        self.clockInterval = setInterval(function () {
          self._runClock();
        }, 1000);
      }
      if(this.date) {
        const inc = 1000 * 60 * 60;
        self._runDate();
        self.dateInterval = setInterval(function () {
          self._runDate();
        }, inc);
      }

      this.classList.remove('hide');
    } else {
      this.stopScreenSaver();
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
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 9999;
          right: 0;
          display: flex;
          flex-direction: column;
          background-color: var(--screensaver-background, #000);
        }

        :host(.hide) {
          display:none;
          visibility: hidden;
        }

        .screensaver {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100%;
          flex-direction: column;
        }
        
        h1 {
          margin:0;
          font-size: 32px;
          line-height: 32px;
          font-weight: 200;
          color: var(--screensaver-text-color, #FFF);
        }
        h1.digitalClock {
          font-size:60px;
          line-height: 60px;
        }
        h1.digitalClock.with-seconds {
          font-size: 48px;
          line-height:48px;
        }
        h2 {
          color: #FFF;
          font-weight: 200;
          font-size: 30px;
          line-height: 30px;
          margin: 15px 0 0 0;
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
  if("screensaver" in lovelace.config) {
    let addCard = false;
    if("deviceIds" in lovelace.config.screensaver) {
      if(lovelace.config.screensaver.deviceIds.includes(deviceID)) {
        addCard = true;
      }
    } else {
      addCard = true;
    }
    
    if(addCard) {
    const screensaverConfig = Object.assign({}, lovelace.config.screensaver);
    let root = getRoot();
    let appLayout = root.shadowRoot.querySelector('ha-app-layout');
    let contentContainer:any = appLayout.shadowRoot.querySelector('#contentContainer');
    await buildCard(contentContainer, screensaverConfig);
    } else {
      console.log('Screensaver in config, but this device is not in the deviceIds list!');
    }
  } else {
    console.log('No Screensaver in config found!');
  }
}

addScreensaver();
