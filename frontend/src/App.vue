<template>
  <v-app>
    <v-app-bar app class="px-2" color="primary" dark dense>
      <h1 class="title">
        Welcome
        <span class="font-weight-regular">{{
          isAuthenticated ? 'User' : 'Guest'
        }}</span>
      </h1>

      <v-spacer></v-spacer>

      <v-btn
        v-if="isAuthenticated"
        dense
        small
        color="red darken-1"
        class="font-weight-bold"
        @click="unauthenticate"
      >
        Un-Authenticate
      </v-btn>

      <v-btn
        v-else
        dense
        small
        color="light-green darken-3"
        class="font-weight-bold"
        @click="authenticate"
        :loading="isAuthenticating"
      >
        Authenticate
      </v-btn>
    </v-app-bar>

    <v-container>
      <v-content>
        <router-view @requestFailed="handleFailedRequest" />
      </v-content>
    </v-container>

    <v-snackbar
      :bottom="true"
      :left="true"
      v-model="notify.active"
      :color="notify.type"
      :timeout="notify.timeout"
    >
      {{ notify.message }}
    </v-snackbar>
  </v-app>
</template>

<script>
import { to } from 'await-to-js'
import { mapGetters, mapActions } from 'vuex'

import { loadingWrapperMixin } from './mixins'

export default {
  name: 'App',

  mixins: [loadingWrapperMixin],

  data() {
    return {
      isAuthenticating: false,

      notify: {
        active: false,
        type: '',
        message: '',
        timeout: 1500
      }
    }
  },

  computed: {
    ...mapGetters(['fullname', 'username', 'password', 'isAuthenticated'])
  },

  methods: {
    ...mapActions(['doAuthenticate', 'doUnauthenticate', 'doVerifyAuth']),

    /**
     * Authenticate user.
     *
     * It calls 'doAuthenticate' that sends request
     * to the server.
     * if not succeeded, display error to user.
     *
     * 'wrapLogic' method will turn 'isSubmittingForm' on/off
     * around the whole logic. So form is disabled while sending
     * request to server.
     */
    authenticate() {
      this.wrapLogic(async () => {
        const [err] = await to(this.doAuthenticate())
        if (err) {
          this.handleFailedRequest(err)
          return
        }
      }, 'isAuthenticating')
    },

    /**
     * Un-Authenticate user.
     *
     * It calls 'doUnauthenticate' that sends request
     * to the server.
     * if not succeeded, display error to user.
     *
     * 'wrapLogic' method will turn 'isSubmittingForm' on/off
     * around the whole logic. So form is disabled while sending
     * request to server.
     */
    unauthenticate() {
      this.wrapLogic(async () => {
        const [err] = await to(this.doUnauthenticate())
        if (err) {
          this.handleFailedRequest(err)
          return
        }
      }, 'isAuthenticating')
    },

    /**
     * Helper method for hanlding failed request to server.
     *
     * @param {Object} {err}   - Response error object
     */
    handleFailedRequest(err) {
      console.log('app handleFailedRequest')
      const { status } = err.response
      let message = err.message ? err.message : 'UNKNOWN ERROR'

      if (status === 401) {
        message = 'Authentication is required to perform this action!'
      }

      this.showErrorNotify(message)
    },

    /**
     * Helper method for setting snackbar properties which is used
     * for displaying an error message to the user.
     *
     * @param {String} {message}   - Notification message
     */
    showErrorNotify(message) {
      this.notify.type = 'error'
      this.notify.message = message
      this.notify.active = true
    }
  },

  async created() {
    await this.doVerifyAuth()
  }
}
</script>
