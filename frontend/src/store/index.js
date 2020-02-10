/**
 * Module dependencies.
 */
import Vue from 'vue'
import Vuex from 'vuex'

import { to } from 'await-to-js'

import api from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated: false
  },

  getters: {
    isAuthenticated: (state) => state.isAuthenticated
  },

  mutations: {
    SET_AUTHENTICATED: (state, bool) => {
      state.isAuthenticated = bool
    }
  },

  actions: {
    /**
     * It's used by App component for first time load,
     * to set/unset isAuthenticated state for the user.
     *
     * It won't handle or return any error.
     * Just pay attention to 401 Unauthorized error.
     */
    doVerifyAuth({ commit }) {
      return new Promise(async (resolve) => {
        const [err] = await to(api.get('/auth/verify'))

        if (err) {
          if (err.response.status === 401) commit('SET_AUTHENTICATED', false)
          return
        }

        commit('SET_AUTHENTICATED', true)
        return resolve()
      })
    },

    /**
     * Used to authenticate current user.
     * Set isAuthenticated as true if request succeeds.
     */
    doAuthenticate({ commit }) {
      return new Promise(async (resolve, reject) => {
        const [err] = await to(api.post('/auth/authenticate'))

        if (err) {
          return reject(err)
        }

        commit('SET_AUTHENTICATED', true)
        return resolve()
      })
    },

    /**
     * Used to unauthenticate current user.
     * Set isAuthenticated as false if request succeeds.
     */
    doUnauthenticate({ commit }) {
      return new Promise(async (resolve, reject) => {
        const [err] = await to(api.post('/auth/unauthenticate'))

        if (err) {
          return reject(err)
        }

        commit('SET_AUTHENTICATED', false)
        return resolve()
      })
    },

    /**
     * Make request to get all tasks.
     *
     * return any error happens, otherwise all tasks.
     */
    doFetchTasks() {
      return new Promise(async (resolve, reject) => {
        const [err, tasks] = await to(
          api.get('/tasks').then((res) => res.data.data)
        )

        if (err) {
          return reject(err)
        }

        return resolve(tasks)
      })
    },

    /**
     * Post a new task to sever.
     *
     * return any error happens, otherwise the new created tasks.
     *
     * @param {String} task - New task to create
     */
    doPostTask({ commit }, task) {
      return new Promise(async (resolve, reject) => {
        const [err, postedTask] = await to(
          api.post('/tasks', task).then((res) => res.data.data)
        )

        if (err) {
          if (err.response.status === 401) commit('SET_AUTHENTICATED', false)
          return reject(err)
        }

        return resolve(postedTask)
      })
    },

    /**
     * Request server to delete specific task.
     *
     * return any error happens, otherwise the deleted tasks.
     *
     * @param {String} id - Task id to be deleted
     */
    doDeleteTask({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        const [err, deletedTask] = await to(
          api.delete(`/tasks/${id}`).then((res) => res.data.data)
        )

        if (err) {
          if (err.response.status === 401) commit('SET_AUTHENTICATED', false)
          return reject(err)
        }

        return resolve(deletedTask)
      })
    },

    /**
     * Request server to update specific task.
     *
     * return any error happens, otherwise the updated tasks.
     *
     * @param {Object} {id, update} - Task id, and
     * an object contains the new update to be done
     */
    doUpdateTask({ commit }, { id, update }) {
      return new Promise(async (resolve, reject) => {
        const [err, updatedTask] = await to(
          api.put(`/tasks/${id}`, update).then((res) => res.data.data)
        )

        if (err) {
          if (err.response.status === 401) commit('SET_AUTHENTICATED', false)
          return reject(err)
        }

        return resolve(updatedTask)
      })
    }
  },

  modules: {}
})
