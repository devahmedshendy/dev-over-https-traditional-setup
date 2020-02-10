<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="390">
        <v-card>
          <v-card-title class="headline">{{ title }}</v-card-title>
          <v-card-text>
            {{ body }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="choose(false)">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" dark @click="choose(true)">
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'confirm-dialog',

  props: {
    title: {
      type: String,
      default: ''
    },
    body: {
      type: String,
      default: ''
    },
    resolve: {
      type: Function
    },
    container: {
      type: HTMLDivElement
    }
  },

  data() {
    return {
      dialog: true,
      confirm: false
    }
  },

  methods: {
    choose(value) {
      this.$emit('result', value)
      this.confirm = value
      this.$destroy()
    }
  },

  destroyed() {
    this.container.removeChild(this.$el)
    this.resolve(this.confirm)
  }
}
</script>

<style scoped></style>
