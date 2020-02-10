/**
 * Module dependencies.
 */
import Vue from 'vue'
import vuetify from './vuetify'

import ConfirmDialog from '../components/ConfirmDialog.vue'

/**
 * This create the plugin with install method,
 * that Vue will execute as away to install this plugin.
 *
 * This plugin is used to create dialog by running its instance
 * method this.$confirmDialog(dialogOptions).
 *
 * The plugin defines Vue instance method called '$confirmDialog'.
 * When called, it does the following:
 * - Create a Vuetify-based class for ConfirmDialog component.
 * - Get reference for the whole document, to act as a container.
 * - Create object that contains required props to share with ConfimDialog.
 * - Create instance from Vuetify-based ConfrimDialog class.
 * - Append that instance as a child to the container.
 */
const ConfirmDialogPlugin = {
  install(Vue, options) {
    // Create a Vuetify-based class
    const VuetifyConfirmDialog = Vue.extend({
      vuetify: options.vuetify,
      ...ConfirmDialog
    })

    delete options.vuetify

    // This is the definition of '$confirmDialog' instance method
    Vue.prototype.$confirmDialog = function(dialogOptions = {}) {
      return new Promise((resolve) => {
        // Get reference for the whole document.
        const container =
          document.querySelector('[data-app=true]') || document.body

        // Create merged object for component props.
        const propsData = {
          // This will help component to resolve confirmation
          // state back to the user executing this plugin.
          resolve,
          // Component will be able to remove itself from this
          // when destroyed.
          container,
          ...options,
          ...dialogOptions
        }

        // Create instance from Vuetify-based ConfrimDialog class.
        const dialogComponent = new VuetifyConfirmDialog({ propsData })

        // Append that instance as a child to the container.
        container.appendChild(dialogComponent.$mount().$el)
      })
    }
  }
}

// Make use of the plugin within Vue
Vue.use(ConfirmDialogPlugin, { vuetify })

export default ConfirmDialogPlugin
