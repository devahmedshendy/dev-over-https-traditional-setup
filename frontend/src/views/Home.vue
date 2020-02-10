<template>
  <div class="home">
    <v-row justify="center" dense no-gutters>
      <v-col cols="8">
        <template v-if="isAuthenticated">
          <v-alert class="body-1" type="success" border="left" dense>
            <span>
              Now, you are authenticated and able to add/update/delete tasks.
            </span>
            <br />
          </v-alert>
        </template>

        <template v-else>
          <v-alert
            class="body-1"
            type="info"
            color="blue-grey"
            border="left"
            dense
          >
            <span>
              Try to add/update/delete tasks to see that you cannot do any
              without being authenticated, then press <b>Authenticate</b> button
              to authenticate yourself.
            </span>
          </v-alert>
        </template>
      </v-col>
    </v-row>

    <v-form
      v-on:submit.prevent="addTask"
      ref="form"
      class="mt-4"
      lazy-validation
    >
      <v-row justify="center" dense>
        <v-col cols="7">
          <v-text-field
            tile
            filled
            dense
            label="Title"
            :disabled="isLoadingData"
            v-model="form.taskTitle"
            prepend-inner-icon="mdi-calendar-check-outline"
            :rules="taskTitleRules"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn
            class="mt-3"
            blocked
            outlined
            :disabled="isLoadingData"
            :loading="isSubmittingForm"
            color="primary"
            @click="addTask"
          >
            <v-icon>mdi-plus-thick</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center" dense no-gutters>
        <v-col cols="11">
          <v-divider></v-divider>
          <v-progress-linear
            bottom
            :active="isLoadingData"
            :indeterminate="true"
            height="2px"
            color="primary"
          ></v-progress-linear>
        </v-col>
      </v-row>

      <v-row justify="center" dense no-gutters>
        <v-col cols="11">
          <v-card class="py-4 px-4 mt-4" outlined>
            <h2 class="caption ml-3 text-uppercase teal--text text--darken-3">
              Pending Tasks
            </h2>

            <v-row v-if="pendingTasks.length <= 0" dense no-gutters>
              <v-col class="text-center" cols="12">
                <span
                  class="overline ml-3 text-center text-uppercase teal--text text--darken-1"
                >
                  No Pending Tasks Yet
                </span>
              </v-col>
            </v-row>

            <template v-for="(task, index) in pendingTasks">
              <v-row dense :key="task.id + '-row'">
                <v-col cols="12">
                  <v-btn text icon color="error" @click="deleteTask(task.id)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>

                  <v-btn
                    text
                    icon
                    color="primary"
                    @click="markTask(task.id, true)"
                  >
                    <v-icon>mdi-checkbox-blank-outline</v-icon>
                  </v-btn>

                  <span class="subtitle-1 ml-2 d-inline-block">
                    {{ task.title }}
                  </span>
                </v-col>
              </v-row>

              <v-divider
                v-if="index < pendingTasks.length - 1"
                :key="task.id"
              ></v-divider>
            </template>
          </v-card>

          <v-card class="py-4 px-4 mt-4" outlined>
            <h2 class="caption ml-3 text-uppercase teal--text text--darken-3">
              Completed Tasks
            </h2>

            <v-row v-if="completedTasks.length <= 0" dense no-gutters>
              <v-col class="text-center" cols="12">
                <span
                  class="overline ml-3 text-center text-uppercase teal--text text--darken-1"
                >
                  No Completed Tasks Yet
                </span>
              </v-col>
            </v-row>

            <template v-for="(task, index) in completedTasks">
              <v-row dense :key="task.id + '-row'">
                <v-col cols="12">
                  <v-btn text icon color="error" @click="deleteTask(task.id)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>

                  <v-btn
                    text
                    icon
                    color="primary"
                    @click="markTask(task.id, false)"
                  >
                    <v-icon>mdi-checkbox-marked-outline</v-icon>
                  </v-btn>

                  <del class="subtitle-1 ml-2 d-inline-block">
                    {{ task.title }}
                  </del>
                </v-col>
              </v-row>

              <v-divider
                v-if="index < completedTasks.length - 1"
                :key="task.id"
              ></v-divider>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-form>

    <v-snackbar
      :bottom="true"
      :left="true"
      v-model="notify.active"
      :color="notify.type"
      :timeout="notify.timeout"
    >
      {{ notify.message }}
    </v-snackbar>
  </div>
</template>

<script>
// @ is an alias to /src
import { to } from 'await-to-js'
import { mapGetters, mapActions } from 'vuex'

import { loadingWrapperMixin } from '../mixins'

export default {
  name: 'home',

  mixins: [loadingWrapperMixin],

  data() {
    return {
      isSubmittingForm: false,
      isLoadingData: false,

      form: {
        taskTitle: ''
      },

      tasks: [],

      taskTitleRules: [(v) => !!v || 'Title is required'],

      notify: {
        active: false,
        type: '',
        message: '',
        timeout: 1500
      }
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated']),

    /**
     * List of only tasks that marked as completed.
     */
    completedTasks() {
      return this.tasks.filter((task) => task.completed)
    },

    /**
     * List of only tasks that are still pending.
     */
    pendingTasks() {
      return this.tasks.filter((task) => !task.completed)
    }
  },

  methods: {
    ...mapActions([
      'doFetchTasks',
      'doPostTask',
      'doUpdateTask',
      'doDeleteTask'
    ]),

    /**
     * Get and render all fetched tasks.
     *
     * It calls doFetchTasks that makes request to server,
     * if succeed, updated tasks array,
     * otherwise, display error to user.
     *
     * 'wrapLogic' method will turn 'isSubmittingForm' on/off
     * around the whole logic. So form is disabled while sending
     * request to server.
     */
    fetchTasks() {
      this.wrapLogic(async () => {
        const [err, tasks] = await to(this.doFetchTasks())

        if (err) {
          this.$emit('requestFailed', err)
          // this.showErrorNotify(err.message)
          return
        }

        this.tasks = tasks
      }, 'isLoadingData')
    },

    /**
     * Add new task.
     *
     * It calls doPostTask that makes request to server,
     * if succeed, remove task from tasks array,
     * otherwise, display error to user.
     *
     * 'wrapLogic' method will turn 'isSubmittingForm' on/off
     * around the whole logic. So form is disabled while sending
     * request to server.
     */
    addTask() {
      this.wrapLogic(async () => {
        if (!this.$refs.form.validate()) return

        const task = { title: this.form.taskTitle }

        const [err, newTask] = await to(this.doPostTask(task))

        if (err) {
          this.$emit('requestFailed', err)
          return
        }

        this.tasks.unshift(newTask)
        this.$refs.form.reset()
      }, 'isSubmittingForm')
    },

    /**
     * Update complete status of specific task.
     *
     * It calls doUpdateTask that makes request to server,
     * if succeed, updated task complete status in tasks array,
     * otherwise, display error to user.
     *
     * 'wrapLogic' method will turn 'isSubmittingForm' on/off
     * around the whole logic. So form is disabled while sending
     * request to server.
     *
     * @param {String} {id}   - Task id
     * @param {Bool}   {bool} - Complete status of task
     */
    async markTask(id, bool) {
      this.wrapLogic(async () => {
        const update = { completed: bool }

        const [err] = await to(this.doUpdateTask({ id, update }))

        if (err) {
          this.$emit('requestFailed', err)
          return
        }

        this.tasks.map((task) => {
          if (task.id === id) task.completed = bool
        })
      }, 'isSubmittingForm')
    },

    /**
     * Delete specific task.
     *
     * It asks use to confirm delete, if confirmed, then
     * call doDeleteTask that makes request to server,
     * if succeed, remove task from tasks array,
     * otherwise, display error to user.
     *
     * 'wrapLogic' method will turn 'isSubmittingForm' on/off
     * around the whole logic. So form is disabled while sending
     * request to server.
     *
     * @param {String} {id}   - Task id
     */
    async deleteTask(id) {
      if (!(await this.confirmTaskDelete())) return

      this.wrapLogic(async () => {
        const [err] = await to(this.doDeleteTask(id))

        if (err) {
          this.$emit('requestFailed', err)
          return
        }

        const index = this.tasks.findIndex((task) => task.id === id)
        this.tasks.splice(index, 1)
      }, 'isSubmittingForm')
    },

    /**
     * Helper method for calling ConfirmDialogPlugin,
     * to show dialog asking user to confirm task delete.
     */
    confirmTaskDelete() {
      return this.$confirmDialog({
        title: 'Do you want to delete this task?'
      })
    }
  },

  /**
   * Make sure all tasks are loaded and rendered
   * once component mounted.
   */
  async mounted() {
    this.fetchTasks()
  }
}
</script>
