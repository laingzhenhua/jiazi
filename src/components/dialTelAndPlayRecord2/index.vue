<template>
  <div v-if="showDialTel">
    <el-button plain type="primary" size="mini" icon="el-icon-phone-outline" @click="dialTel">拨打电话</el-button>
    <el-button plain type="primary" size="mini" icon="el-icon-video-play" @click="playRecord">播放录音</el-button>

    <dialTelDialog ref="dialTelDialog" :info="info" :applySence="applySence" @phoneCheck="getPhone"></dialTelDialog>
    <playRecord ref="playRecord" :applySence="applySence" :info="info"></playRecord>
  </div>
</template>

<script>
    let dialTelDialog = () => import('./dialTelDialog.vue')
    let playRecord = () => import('./playRecord.vue')
    export default {
        props: {
            info: {
                type: Object,
                default: () => {
                    return {
                        id: '',
                        deteilId: '',
                        phone: '—',
                        contactTel: '—'
                    }
                }
            },
            callBack: {
                type: Function,
                require: true
            },
            applySence:{
                type: String
            }
        },

        data() {
            return {
                showDialTel: true
            }
        },
        mounted() {
            // console.log(this.serverConfig)
        },
        methods: {
            dialTel() {
                this.$refs.dialTelDialog.dialogVisible = true
            },
            playRecord() {
                this.$refs.playRecord.dialogVisible = true
            },
            getPhone(data) {
                this.callBack(data)
                this.dialogVisible = false
            }
        },

        components: {
            dialTelDialog,
            playRecord
        }
    }
</script>
