<template>
  <div :class="cardClass">
    <el-popover
      placement="top"
      width="228"
      trigger="click"
      title="切换原因"
      :content="sampleData.swapReason?sampleData.swapReason:'未填写'"
    >
      <div class="uncontact-box" slot="reference"></div>
    </el-popover>
    <div class="sample-box" @click="handleClick">
      <div class="sample-tag" v-if="residentTag">
        <EmhiSvgIcon iconClass="card_tag"/>
        <span>{{residentTag}}</span>
      </div>
      <div class="sample-avatar">
        <EmhiSvgIcon iconClass="card_avatar"/>
      </div>
      <div class="sample-text">
        <h6>
          <!-- {{sampleData.name?sampleData.name:'无名氏'}} -->
          <span :title="sampleData.name">{{name}}</span>
          <span
            class="sample-btn"
            style="background-color:#F3536A;color:#fff"
            v-if="sampleData.truthResult === 0"
          >{{btnName[0]}}</span>
          <span
            class="sample-btn"
            style="background-color:#1BB99A;color:#fff"
            v-if="sampleData.truthResult === 1"
          >{{btnName[1]}}</span>
          <span class="sample-btn" v-if="showChange" @click.stop="handleChange">切换></span>
        </h6>
        <p>
          <EmhiSvgIcon iconClass="card_tel"/>
          {{sampleData.telNumber?sampleData.telNumber:'—'}}
        </p>
        <p>
          <EmhiSvgIcon iconClass="card_org"/>
          {{sampleData.orgName?sampleData.orgName:'—'}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
    import EmhiSvgIcon from "/src/components/EmhiSvgIcon";
    export default {
        components: { EmhiSvgIcon },
        props: {
            currentSample: {
                type: String,
                default: "",
            },
            sampleData: {
                type: Object,
                default() {
                    return {};
                },
            },
            btnName: {
                type: Array,
                default() {
                    return ["不规范", "规范"];
                },
            },
        },
        data() {
            return {
                tagDict: [
                    { key: "0", value: "普" },
                    { key: "1", value: "老" },
                    { key: "2", value: "糖" },
                    { key: "3", value: "高" },
                    { key: "4", value: "儿" },
                    { key: "410", value: "儿" },
                    { key: "420", value: "儿" },
                    { key: "421", value: "儿" },
                    { key: "422", value: "儿" },
                    { key: "5", value: "孕" },
                    { key: "6", value: "亡" },
                    { key: "7", value: "肺" },
                    { key: "8", value: "残" },
                    { key: "9", value: "精" },
                    { key: "10", value: "低" },
                ],
            };
        },
        computed: {
            // 卡片样式格式化
            cardClass() {
                if (this.sampleData.contactState == "-1") {
                    return "uncontact";
                } else if (this.sampleData.detailId === this.currentSample) {
                    return "active";
                } else {
                    return "default";
                }
            },
            // 标签格式化
            residentTag() {
                console.log(this.sampleData)
                for (const item of this.tagDict) {
                    if(this.sampleData.fdSignExcludeSampleType===1){
                        return this.sampleData.excludeReason
                    }else if (this.sampleData.residentGroup === item.key) {
                        return item.value;
                    }
                }
                return "";
            },
            // 显示切换按钮
            showChange() {
                if (this.sampleData.contactState === -1) {
                    return false;
                } else if (this.sampleData.truthResult == null) {
                    return true;
                } else {
                    return false;
                }
            },
            // 姓名
            name() {
                if (this.sampleData.name) {
                    if (this.sampleData.name.length > 4) {
                        return this.sampleData.name.substring(0, 3) + "..";
                    } else {
                        return this.sampleData.name;
                    }
                } else {
                    return "无名氏";
                }
            },
        },
        methods: {
            handleClick() {
                this.$emit("clickCard", { cardData: this.sampleData });
            },
            handleChange() {
                this.$emit("clickBtn", { cardData: this.sampleData });
            },
        },
    };
</script>

<style lang="less" scoped>
.default {
  position: relative;
}
.uncontact {
  .uncontact-box {
    z-index: 1;
  }
  .sample-tag {
    svg {
      color: #999;
    }
  }
  .sample-avatar {
    background-color: #999;
    svg {
      color: #fff;
    }
  }
  .sample-text {
    h6,
    p {
      color: #999;
    }
  }
}
.active {
  .sample-box {
    background-color: #e6f5fb;
      margin-right: 10px;
  }
  .sample-avatar {
    background-color: #00acc7;
    svg {
      color: #fff;
    }
  }
  .sample-text {
    p {
      color: #00acc7;
    }
  }
  .sample-btn {
    background-color: #00acc7;
    color: #fff;
  }
}
.uncontact-box {
  width: 258px;
  height: 112px;
  position: absolute;
  z-index: -1;
}
.sample-box {
    width: 256px;
    height: 110px;
    border: 1px solid #d8dee2;
    position: relative;
    margin-right:20px;
}
.sample-tag {
  position: absolute;
  top: 0;
  right: 20px;
  svg {
    font-size: 24px;
    color: #00acc7;
  }
  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    text-align: center;
    color: #fff;
  }
}
.sample-avatar {
  position: absolute;
  left: 20px;
  top: 25px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #daf5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    font-size: 44px;
    color: #00acc7;
  }
}
.sample-text {
  position: absolute;
  left: 96px;
  top: 20px;
  width: 150px;
  h6 {
    font-size: 16px;
    line-height: 20px;
    color: #00acc7;
    margin-bottom: 10px;
  }
  p {
    font-size: 12px;
    line-height: 22px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.sample-btn {
  display: inline-block;
  margin-left: 8px;
  padding: 0 8px;
  font-size: 12px;
  background-color: #daf5fa;
  border-radius: 10px;
  cursor: pointer;
}
</style>
