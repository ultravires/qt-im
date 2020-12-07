<template>
	<div class="chat-editor-wrapper">
		<div ref="editorWrap" class="chat-editor">
			<div ref="toolbar" class="chat-editor__toolbar">
				<!-- <button class="ql-bold">加粗</button>
				<button class="ql-italic">斜体</button>
				<button class="ql-underline">下划线</button>
				<button class="ql-strike">中划线</button> -->
			</div>
			<div ref="editor" class="chat-editor__editor"></div>
		</div>
	</div>
</template>


<script>
import Tribute from "tributejs";
import Quill from 'quill';
import 'quill/dist/quill.core.css';

const Parchment = Quill.imports.parchment;
// const Delta = Quill.imports.delta;

class Mention extends Parchment.Embed {
	static create(value) {
		const node = super.create(value);
		node.innerText = value;
		node.contentEditable = 'false';
		return node;
	}

	static value(node) {
		return node.childNodes[0].textContent;
	}
}
Mention.blotName = 'mention';
Mention.tagName = 'SPAN';
Mention.className = 'at-mention';

Quill.register(Mention);

export default {
	name: 'QuillEditor',

	props: {
		mention: {
			type: Boolean,
			default: false
		},

		extandBar: {
			type: Array,
			default: () => {
				return ['font', 'emoji', 'shake', 'screenshot', 'picture', 'file', 'secre', 'history']
			}
		}
	},

	created() {
		this.editor = null;
	},

	mounted() {
		this.initEditor();
	},

	methods: {
		initEditor() {
			const container = this.$refs.editor;
			const options = {
				debug: 'warn',
				placeholder: false,
				modules: {
					toolbar: this.$refs.toolbar
				},
				readOnly: false,
				theme: false
			};
			const editor = this.editor = new Quill(container, options);

			editor.keyboard.bindings[13].unshift({
				key: 13,
				// eslint-disable-next-line no-unused-vars
				handler: (range, context) => {
					this.$emit('enter', range, context);
					return false; // prevent future bubbling
				}
			});

			this.mention && this.initMention(editor.root);
		},

		initMention(editorRoot) {
			const that = this;

			const tribute = new Tribute({
				collection: [{
					// symbol or string that starts the lookup
					trigger: '@',

					// element to target for @mentions
					iframe: null,

					// class added in the flyout menu for active item
					selectClass: 'highlight',

					// class added to the menu container
					containerClass: 'tribute-container',

					// class added to each list item
					itemClass: 'tribute-mention__item',

					// function called on select that returns the content to insert
					selectTemplate: function (item) {
						return Mention.create(' @' + item.original.value).outerHTML;
					},

					// template for displaying item in menu
					menuItemTemplate: function (item) {
						return item.string;
					},

					// column to search against in the object (accepts function or string)
					lookup: 'key',

					// column that contains the content to insert by default
					fillAttr: 'value',

					// REQUIRED: array of objects to match or a function that returns data (see 'Loading remote data' for an example)
					values: [
						{ key: "Phil Heartman", value: "pheartman", email: "pheartman@gmail.com" },
						{ key: "Gordon Ramsey", value: "gramsey", email: "gramsey@gmail.com" },
						{ key: "张三", value: "张三" },
						{ key: "王麻子", value: "王麻子" },
						{ key: "狗蛋子", value: "狗蛋子" },
						{ key: "狗蛋子", value: "狗蛋子" },
						{ key: "李四", value: "李四" }
					],

					// When your values function is async, an optional loading template to show
					loadingItemTemplate: null,

					// specify whether a space is required before the trigger string
					requireLeadingSpace: false,

					// specify whether a space is allowed in the middle of mentions
					allowSpaces: false,

					// optionally specify a custom suffix for the replace text
					// (defaults to empty space if undefined)
					replaceTextSuffix: '\n',

					// specify whether the menu should be positioned.  Set to false and use in conjuction with menuContainer to create an inline menu
					// (defaults to true)
					positionMenu: true,

					// when the spacebar is hit, select the current match
					spaceSelectsMatch: false,

					// turn tribute into an autocomplete
					autocompleteMode: false,

					// Customize the elements used to wrap matched strings within the results list
					// defaults to <span></span> if undefined
					searchOpts: {
						pre: '<span>',
						post: '</span>',
						skip: false // true will skip local search, useful if doing server-side search
					},

					// Limits the number of items in the menu
					menuItemLimit: 25,

					// specify the minimum number of characters that must be typed before menu appears
					menuShowMinLength: 0
				}],

				// template for when no match is found (optional),
				// If no template is provided, menu is hidden.
				noMatchTemplate: function () {
					return '';
				},

				// specify an alternative parent container for the menu
				// container must be a positioned element for the menu to appear correctly ie. `position: relative;`
				// default container is the body
				menuContainer: document.body,

				// specify whether a space is allowed in the middle of mentions
				allowSpaces: false,
			});

			tribute.attach(editorRoot);

			editorRoot.addEventListener('tribute-active-true', function() {
				that.editor.keyboard.bindings[13].unshift({
					key: 13,
					// eslint-disable-next-line no-unused-vars
					handler: (range, context) => {
						return false; // prevent future bubbling
					}
				});
			}, false);

			editorRoot.addEventListener('tribute-active-false', function() {
				that.editor.keyboard.bindings[13].shift();
			}, false);
		},

		getCursorIndex() {
			var range = this.editor.getSelection();
			if (range) {
				if (range.length == 0) {
					return range.index;
				}
				// user has highlighted some text
				return [range.index, range.length];
			}
			// user cursor is not in editor
			return -1;
		}
	}
}
</script>


<style scoped>
.chat-editor {
	position: relative;
	height: 100%;
	overflow: hidden;
}

.chat-editor-wrapper {
	width: 100%;
	height: calc(100% - 40px);
}
</style>

<style>
/* @mention css - std */
.tribute-container {
	padding-top: 6px;
	padding-bottom: 6px;
	background-color: #fff;
	border: 1px solid rgba(0, 0, 0, 0.07);
	border-radius: 3px;
}

.tribute-container .tribute-mention__item {
	padding-left: 6px;
	padding-right: 6px;
	list-style: none;
}

.tribute-container .tribute-mention__item.highlight {
	background-color: #f8f0d3;
}

.tribute-container ul {
	margin: 0;
	padding: 0;
}

.tribute-container ul > li {
	list-style: none;
	line-height: 2;
}

.chat-editor .at-mention {
	color: #13cffc;
}
/* @mention css - end */
</style>
