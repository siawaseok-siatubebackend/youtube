/**
 * ヘッダー検索設定の管理ロジック（リファクタリング版）
 */

const STORAGE_KEYS = {
  DEFAULT_PLAYBACK: 'defaultPlaybackMode',
  SHORT_VIDEO_FILTER_ENABLED: 'shortVideoFilterEnabled',
  SHORT_VIDEO_FILTER_MINUTES: 'shortVideoFilterMinutes',
  DARK_MODE: 'darkMode',
};

const DEFAULTS = {
  DEFAULT_PLAYBACK_MODE: '1',
  SHORT_VIDEO_MINUTES: 4,
};

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`safeSetItem error [${key}]`, e);
  }
}

function safeGetItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw);
    } catch (_) {
      // 既存ストレージが生の文字列の場合はそのまま返す
      return raw;
    }
  } catch (e) {
    console.error(`safeGetItem error [${key}]`, e);
    return fallback;
  }
}

function setCookie(name, value, days = 3650) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  try {
    const pair = document.cookie.split('; ').find((p) => p.startsWith(`${name}=`));
    if (!pair) return null;
    return decodeURIComponent(pair.split('=')[1] || '');
  } catch (e) {
    console.error(`getCookie error [${name}]`, e);
    return null;
  }
}

/**
 * デフォルト再生方式を保存
 * @param {string} mode
 */
export function saveDefaultPlayback(mode) {
  try {
    setCookie('StreamType', mode, 3650); // ほぼ永久
    safeSetItem(STORAGE_KEYS.DEFAULT_PLAYBACK, String(mode));
  } catch (e) {
    console.error('saveDefaultPlayback error', e);
  }
}

/**
 * デフォルト再生方式を読み込み
 * @returns {string}
 */
export function loadDefaultPlayback() {
  try {
    const fromStorage = safeGetItem(STORAGE_KEYS.DEFAULT_PLAYBACK, null);
    if (fromStorage !== null && fromStorage !== undefined && fromStorage !== '') return String(fromStorage);

    const cookieMode = getCookie('StreamType');
    if (cookieMode) {
      safeSetItem(STORAGE_KEYS.DEFAULT_PLAYBACK, String(cookieMode));
      return cookieMode;
    }

    return DEFAULTS.DEFAULT_PLAYBACK_MODE;
  } catch (e) {
    console.error('loadDefaultPlayback error', e);
    return DEFAULTS.DEFAULT_PLAYBACK_MODE;
  }
}

/**
 * 短動画フィルタ設定を保存
 * @param {boolean} enabled
 * @param {number} minutes
 */
export function saveShortVideoFilter(enabled, minutes) {
  try {
    safeSetItem(STORAGE_KEYS.SHORT_VIDEO_FILTER_ENABLED, !!enabled);
    safeSetItem(STORAGE_KEYS.SHORT_VIDEO_FILTER_MINUTES, Number(minutes));

    window.__autoplayDurationFilter = {
      enabled: !!enabled,
      minutes: Number(minutes),
      maxSeconds: Number(minutes) * 60,
    };
    console.log('[settings] saveShortVideoFilter:', window.__autoplayDurationFilter);
  } catch (e) {
    console.error('saveShortVideoFilter error', e);
  }
}

/**
 * 短動画フィルタ設定を読み込み
 * @returns {{enabled: boolean, minutes: number}}
 */
export function loadShortVideoFilter() {
  try {
    const enabled = safeGetItem(STORAGE_KEYS.SHORT_VIDEO_FILTER_ENABLED, null);
    const minutes = safeGetItem(STORAGE_KEYS.SHORT_VIDEO_FILTER_MINUTES, null);

    const result = {
      enabled: enabled !== null ? Boolean(enabled) : false,
      minutes: minutes !== null ? Number(minutes) : DEFAULTS.SHORT_VIDEO_MINUTES,
    };

    window.__autoplayDurationFilter = {
      enabled: result.enabled,
      minutes: result.minutes,
      maxSeconds: result.minutes * 60,
    };

    console.log('[settings] loadShortVideoFilter:', window.__autoplayDurationFilter);
    return result;
  } catch (e) {
    console.error('loadShortVideoFilter error', e);
    return { enabled: false, minutes: DEFAULTS.SHORT_VIDEO_MINUTES };
  }
}

/**
 * ダークモード設定を保存
 * @param {boolean} isDark
 */
export function saveDarkMode(isDark) {
  try {
    safeSetItem(STORAGE_KEYS.DARK_MODE, !!isDark);
  } catch (e) {
    console.error('saveDarkMode error', e);
  }
}

/**
 * ダークモード設定を読み込み
 * @returns {boolean}
 */
export function loadDarkMode() {
  try {
    const stored = safeGetItem(STORAGE_KEYS.DARK_MODE, null);
    return stored !== null ? Boolean(stored) : false;
  } catch (e) {
    console.error('loadDarkMode error', e);
    return false;
  }
}

/**
 * URLが有効か検証
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

export default {
  saveDefaultPlayback,
  loadDefaultPlayback,
  saveShortVideoFilter,
  loadShortVideoFilter,
  saveDarkMode,
  loadDarkMode,
  isValidUrl,
};
