/**
 * This mixin adds 'wrapLogic' method to Vue instance, that acts as
 * a wrapper for some logic to execute as following:
 * - Turn on loading state
 * - Run the logic (ex: fetch all tasks)
 * - Turn off loading state
 *
 * Loading state is flexible here, so user provides the string
 * name of this loading state to call around the logic.
 */
export const loadingWrapperMixin = {
  methods: {
    /**
     * @param {Function} wrappedLogic - The logic to wrap and execute
     * @param {String} loadingProp - A string name of property
     */
    wrapLogic(wrappedLogic, loadingProp) {
      return (async () => {
        this[loadingProp] = true
        const result = await wrappedLogic.apply(this, arguments)
        this[loadingProp] = false

        return result
      })()
    }
  }
}
