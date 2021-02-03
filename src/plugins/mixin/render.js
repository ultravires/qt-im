import Vue from 'vue';


export default {
	install() {
		Vue.mixin({
			mounted() {
				document.body.visible = true;
			}
		});
	}
};
