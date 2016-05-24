// This works on all devices/browsers, and uses IndexedDBShim as a final fallback
import AppStore from '../../stores/AppStore'
export default (user_id) => {
  const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB
  // Open (or create) the database
  const open = indexedDB.open('RechatDB', 1)
  // Create the schema
  open.onupgradeneeded = () => {
    const db = open.result
    db.createObjectStore('rooms', { keyPath: 'user_id' })
  }
  open.onsuccess = () => {
    // Start a new transaction
    const db = open.result
    const tx = db.transaction('rooms', 'readwrite')
    const store = tx.objectStore('rooms')
    // Query the data
    const get_rooms = store.get(user_id)
    get_rooms.onsuccess = () => {
      if (get_rooms.result) {
        // Kill if API response faster
        if (AppStore.data.rooms_loaded && !AppStore.data.rooms)
          return
        let rooms = get_rooms.result.rooms
        // remove personal room
        rooms = rooms.filter(room => {
          return room.room_type !== 'Personal'
        })
        AppStore.data.rooms = rooms
        AppStore.data.rooms_loaded = true
        AppStore.emitChange()
      }
    }
    // Close the db when the transaction is done
    tx.oncomplete = () => {
      db.close()
    }
  }
}