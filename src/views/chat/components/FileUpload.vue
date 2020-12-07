<template>
	<file-upload
		ref="upload"
		v-model="files"
		:thread="1"
		:customAction="customAction"
		:multiple="true"
		:drop="true"
		:drop-directory="true"
		@input-file="inputFile"
	>
	</file-upload>
</template>


<script>
import VueUploadComponent from 'vue-upload-component';
import { uploadDirectory, uploadFile } from '@/api/file';

export default {
	name: 'FileUpload',

	components: { 'file-upload': VueUploadComponent },

	data() {
		return {
			uploadId: '',
			// 上传文件
			files: [],
			// 上传文件列表预览
			filesView: [],
			autoUpload: false
		}
	},

	created() {
		this.$nextTick(function() {
			this.$emit('rendered');
		});
	},

	methods: {
		// eslint-disable-next-line no-unused-vars
		async customAction(file, component) {
			let isDirectory = file.name.indexOf('/') !== -1;
			let filePath = isDirectory ? file.name : '';
			let [fileName, fileExtensionName] = file.name.split('.');
			let formData = new FormData();
			formData.append('file', file.file);
			if (isDirectory) {
				return await uploadDirectory(formData, { id: this.uploadId || '', filePath: encodeURIComponent(filePath), displayName: encodeURIComponent(fileName), ext: fileExtensionName, msgType: 'IMAGE' }).then(res => {
					if (res.success) {
						this.uploadId = res.data;
					}
				});
			}
			return await uploadFile(formData, { displayName: encodeURIComponent(file.name), ext: fileExtensionName, msgType: 'IMAGE' }).then(res => {
				console.log(res);
			}).catch(err => {
				console.error(err);
			});
		},

		abort(file) {
			this.$refs.upload.update(file, { active: false });
		},

		stop() {
			this.$refs.upload.active = false;
		},

		upload() {
			this.$refs.upload.active = true;
		},

		remove(file) {
			this.$refs.upload.remove(file)
		},

		inputFile(newFile, oldFile) {
			console.log(newFile, oldFile)
			if (newFile && !oldFile) {
				// 添加文件
			}

			// 更新文件
			if (newFile && oldFile) {
				// 开始上传
				if (newFile.active !== oldFile.active) {
					// 限制文件大小
					if (!(newFile.size > 0 && newFile.size <= 100 * Math.pow(1024, 3))) {
						newFile = this.$refs.upload.update(newFile, { error: '超出文件大小限制！' });
					}
				}

				// 上传进度
				if (newFile.progress !== oldFile.progress) {
					console.log('progress', newFile.progress, newFile);
				}

				// 上传错误
				if (newFile.error !== oldFile.error) {
					console.warn('error', newFile.error, newFile);
				}

				// // 上传成功
				if (newFile.success !== oldFile.success) {
					console.log('success', newFile.success, newFile);
				}
			}

			if (!newFile && oldFile) {
				// 删除文件
				console.log("删除文件");

				if (oldFile.success) {
					// TODO 从服务器删除文件
				}
			}

			// 自动上传
			if (this.autoUpload) {
				if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
					if (!this.$refs.upload.active) {
						this.$refs.upload.active = true
					}
				}
			}
		},

		inputFilter(newFile, oldFile, prevent) {
			if (newFile && !oldFile) {
				if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
					return prevent();
				}
			}

			newFile.blob = '';
			let URL = window.URL || window.webkitURL;
			if (URL && URL.createObjectURL) {
				newFile.blob = URL.createObjectURL(newFile.file);
			}
		}
	}
}
</script>
