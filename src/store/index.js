import Vue from 'vue';
import Vuex from 'vuex';
import * as fb from '../firebase';
import router from '../router';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		userProfile: {},
		pubNubUUID: {}
	},
	mutations: {
		setUserProfile(state, val) {
			state.userProfile = val;
		},
		setPubNubUUID(state, uuid) {
			state.pubNubUUID = uuid;
		}
	}, // mutations vs actions: actions can be async
	actions: {
		async login({ dispatch }, form) {
			// TODO: exception handling (promises)
			// sign user in
			const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password);

			// set pubnub uuid:
			dispatch('setPubNubUUID', 'test_uuid')

			// fetch user profile and set in state
			dispatch('fetchUserProfile', user);
		},
		async fetchUserProfile({ commit }, user) {
			// fetch user profile
			const userProfile = user; // TODO: get user from db

			// set user profile in state
			commit('setUserProfile', userProfile);
			
			// change route to dashboard
			if (router.currentRoute.path === '/') {
				router.push('/home')
			}
		},
		async logout({ commit }) {
			// log user out
			await fb.auth.signOut();

			// clear user data from state
			commit('setUserProfile', {});

			// redirect to login view
			router.push('/');
		},
		async changePW({ dispatch }, form) {
			fb.auth.sendPasswordResetEmail(form.email).then(function() {
				// Email sent.
				alert('¡Se ha enviado un correo para cambiar su contraseña!')
				dispatch('logout');
			}).catch(function(error) {
				// An error happened.
				console.log(error);
			});
		},
		setPubNubUUID({ commit }, uuid) {
			commit('setPubNubUUID', uuid);
		}
	},
	// getters: {
	// 	getMyPubNubUUID: (state) => state.pubNubUUID,
	// 	getMyUserProfile: (state) => state.userProfile
	// }
});