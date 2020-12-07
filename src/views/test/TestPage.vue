<template>
	<div ref="editor" id="quill-editor"></div>
</template>


<script>
import Quill from 'quill';
import 'quill/dist/quill.core.css';

export default {
	name: 'TestPage',

	data() {
		return {
			options: {
				debug: 'warn',
				placeholder: 'Quill Editor',
				readOnly: false,
				theme: false
			}
		};
	},

	mounted() {
		this.initEditor();
	},

	methods: {
		initEditor() {
			let editorContainer = this.$refs.editor;
			let editor = new Quill(editorContainer, this.options);

			console.log(editor.getContents());
		}
	}
}
</script>


<style>
html, body {
	height: 100%;
	margin: 0;
	padding: 0;
}

html {
	padding: 5px;
	box-sizing: border-box;
}

.windows {
	position: relative;
	box-shadow: 0 0 5px 1px rgba(0, 0, 0, .2);
	border-radius: 1px;
	box-sizing: border-box;
	overflow: hidden;
}
</style>
