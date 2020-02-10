/**
 * Module dependencies.
 */
import axios from 'axios'

import config from '../config'

// Set default configuration for Axios
axios.defaults.withCredentials = true
axios.defaults.baseURL = config.BACKEND_URL
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

export default axios
