/**
 * Storage Module - localStorage abstraction layer
 * Handles all data persistence with error handling
 */

const Storage = {
    // Storage keys
    KEYS: {
        HABITS: 'habits',
        THEME: 'theme',
        DATA_VERSION: 'dataVersion'
    },

    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {any} data - Data to save (will be JSON stringified)
     * @returns {boolean} Success status
     */
    save(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error(`Storage save error for key "${key}":`, error);
            if (error.name === 'QuotaExceededError') {
                alert('Storage quota exceeded. Please delete some habits or clear old data.');
            }
            return false;
        }
    },

    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Parsed data or default value
     */
    load(key, defaultValue = null) {
        try {
            const jsonData = localStorage.getItem(key);
            if (jsonData === null) {
                return defaultValue;
            }
            return JSON.parse(jsonData);
        } catch (error) {
            console.error(`Storage load error for key "${key}":`, error);
            return defaultValue;
        }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Storage remove error for key "${key}":`, error);
            return false;
        }
    },

    /**
     * Clear all storage
     * @returns {boolean} Success status
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },

    /**
     * Check if storage is available
     * @returns {boolean} Storage availability
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
};
