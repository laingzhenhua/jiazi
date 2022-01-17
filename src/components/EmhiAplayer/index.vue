<template>
  <Aplayer ref="player" v-if="display" :music="music" autoplay />
</template>

<script>
    import Aplayer from "vue-aplayer";
    Aplayer.disableVersionBadge = true

    export default {
        components: { Aplayer },
        props: {
            audio: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                display: false,
                music: {
                    src: '',
                    title: '',
                    artist: ''
                }
            };
        },
        computed: {
            id() {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.music.title = `呼叫人：${this.audio.fromUser}`
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.music.artist = `呼叫时间：${this.audio.createTime}`
                return this.audio.fileId
            }
        },
        mounted() {
            if (this.id) this.visitFile()
        },
        watch: {
            id(nv) {
                this.display = false
                this.$nextTick(() => {
                    if (nv) this.visitFile()
                });
            }
        },
        methods: {
            async visitFile() {
                try {
                    let token = await this.$api.common.useCredential()
                    this.music.src = `${this.serverConfig.downloadUrl}/download/${this.id}${token}`
                    this.display = true
                } catch (error) {}
            }
        }
    };
</script>

<style>
</style>
