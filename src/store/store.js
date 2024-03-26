import {createStore} from "vuex";
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state () {
    return {
      API_URL: 'http://143.110.182.202:8888',
      userToken: null,
      isAuthorized: false,
      nickname: null,
      email: null,
      id: null,
      config: null,

    }
  },
  mutations: {
    setToken(state, token) {
      state.userToken = token;
    },
    setAuthorized (state) {
      state.isAuthorized = true;
      state.isAuthorized = true;
    },
    setUnauthorized (state) {
      state.isAuthorized = false;
    },
    setNickname (state, nickname) {
      state.nickname = nickname;
    },
    setEmail (state, email) {
      state.email = email;
    },
    setId (state, id) {
      state.id = id;
    },
    setConfig(state, config) {
      state.config = config;
    },
    logout(state) {
      state.userToken = null;
      state.isAuthorized = false;
      state.nickname = null;
      state.id = null;
      state.email = null;
      state.config = null;
    },
  },

  actions: {
    checkTokenExpiration({ commit, state }) {
      if (state.userToken && state.userToken.timestamp) {
        const currentTime = new Date().getTime();
        const tokenTime = state.userToken.timestamp;
        const elapsedTime = currentTime - tokenTime;
        const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;

        if (elapsedTime >= twelveHoursInMilliseconds) {
          commit('logout');
        }
      }
    },
  },
  plugins: [createPersistedState()]
})
