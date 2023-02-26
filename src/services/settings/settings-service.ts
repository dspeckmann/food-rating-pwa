import { ApplicationSettings } from './application-settings';

const SETTINGS_KEY = 'applicationSettings'

export default class SettingsService {  
  private _settings: ApplicationSettings

  constructor() {
    this._settings = this.getDefaultSettings()
  }

  getSettings() {
    return this._settings
  }

  loadSettings() {
    const storedSettings = localStorage.getItem(SETTINGS_KEY)
    if (storedSettings) {
      this._settings = JSON.parse(storedSettings)
    }
  }

  updateSettings(newSettings: ApplicationSettings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
  }

  private getDefaultSettings(): ApplicationSettings {
    return {
      ratingSettings: {
        showTaste: true,
        showWellbeing: true,
        showComment: true,
        showPicture: true,
        showFoodComment: true,
        showFoodPicture: true
      }
    }
  }
}
