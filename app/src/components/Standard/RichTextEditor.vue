<template>
    <ckeditor :editor="editor" v-model="value" :config="config" @ready="setupEditor"></ckeditor>
</template>

<script>

    import CKEditor from '@ckeditor/ckeditor5-vue2';
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

    export default {
        name: "RickTextEditor",
        props: {
            value: String,
            config: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        watch: {
            value (newValue) {
                this.$emit("input", newValue)
            }
        },
        components: {
            ckeditor: CKEditor.component,
        },
        data () {
            return {
                editor: ClassicEditor
            }
        },
        methods: {
            setupEditor (editor) {
                let that = this
                editor.editing.view.change( writer => {
                    writer.setStyle( 'height', that.config.height || '300px', editor.editing.view.document.getRoot() );
                } );
            }
        }
    }
</script>

<style scoped lang="scss">

</style>