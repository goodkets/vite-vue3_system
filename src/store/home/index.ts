import {
    defineStore
} from 'pinia'

export const homeStoreInfo = defineStore('home', {
    state: () => {
        return {
            collapsed: false
        }
    },
    getters: {},
    actions: {
        changeCollapsed() {
            this.collapsed = !this.collapsed
            return this.collapsed
        }
    }
})