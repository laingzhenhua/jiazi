<template>
  <el-dialog v-dialogDrag :close-on-click-modal="false" :visible.sync="dialogVisible" @close="handleClose" title="播放录音" width="860px" append-to-body>
    <div class="play-record" v-show="playingAudio.fileId">
      <EmhiAplayer :audio="playingAudio" />
    </div>
    <el-table :data="tableData" stripe size="small" max-height="500px">
      <el-table-column label="呼叫人" prop="fromUser"></el-table-column>
      <el-table-column label="呼叫号码" prop="outNo"></el-table-column>
      <el-table-column label="通话时间" prop="callDuraction"></el-table-column>
      <el-table-column label="通话状态" prop="callStatus"></el-table-column>
      <el-table-column label="拨打时间" prop="createTime" width="160"></el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <div class="mhi-table-i">
            <i v-if="scope.row.fileId" :class="
                scope.row.fileId === playingAudio.fileId
                  ? 'el-icon-video-pause'
                  : 'el-icon-video-play'
              " @click="playingRecord(scope.row)" title="播放"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
    import EmhiAplayer from '/src/components/EmhiAplayer'

    export default {
        components: { EmhiAplayer },
        props: ['info', 'applySence'],
        data() {
            return {
                tableData: [],
                dialogVisible: false,
                playingAudio: {}
            }
        },
        watch: {
            dialogVisible(nv) {
                nv && this.getRecordList()
            }
        },
        methods: {
            playingRecord(row) {
                if (row.fileId == this.playingAudio.fileId) {
                    this.playingAudio = {}
                } else {
                    this.playingAudio = row
                }
            },
            handleClose() {
                this.playingAudio = {}
            },
            async getRecordList() {
                let param = {
                    id: this.info.detailId || this.info.id,
                    applySence: this.applySence
                }
                const res = await this.$http.common.phoneRecordingList(param)
                console.log(res)
                if (res.code === 0) {
                    this.tableData = res.data
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.play-record {
  margin-bottom: 10px;
}
</style>
