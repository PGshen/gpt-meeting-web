<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-05-19 13:03:51
 * @LastEditTime: 2023-07-09 11:05:35
-->
<template>
  <div class="meeting">
    <div class="aside">
      <div class="child-1">
        <p class="child-1-text">
          GPT-Meeting
        </p>
        <el-text size="small">
          {{ meetingName }}
        </el-text>
      </div>
      <div class="meeting-agenda">
        <el-scrollbar>
          <el-steps
            direction="vertical"
            :active="activedNum"
            :space="10"
          >
            <el-step
              v-for="item in flow"
              :key="item.nodeInfo.id"
              :title="item.nodeInfo.nodeType"
            >
              <template #description>
                <div
                  class="item"
                  @click="onSelect(item)"
                >
                  <p style="padding: 3px 0px; font-size: 14px; font-weight: bolder;">
                    {{ item.nodeInfo.nodeName }}
                  </p>
                  <p v-if="item.nodeInfo.prologuePrompt">
                    <span>开场:</span> {{ item.nodeInfo.prologuePrompt }}
                  </p>
                  <p v-if="item.nodeInfo.optimizationPrompt">
                    <span>优化:</span> {{ item.nodeInfo.optimizationPrompt }}
                  </p>
                  <p v-if="item.nodeInfo.processingPrompt">
                    <span>处理:</span> {{ item.nodeInfo.processingPrompt }}
                  </p>
                  <p v-if="item.nodeInfo.quizPrompt">
                    <span>提问:</span> {{ item.nodeInfo.quizPrompt }}
                  </p>
                  <p v-if="item.nodeInfo.summaryPrompt">
                    <span>总结:</span> {{ item.nodeInfo.summaryPrompt }}
                  </p>
                </div>
              </template>
            </el-step>
          </el-steps>
        </el-scrollbar>
      </div>
    </div>
    <el-container>
      <el-header
        style="display: flex; align-items: center; border-bottom: 1px solid rgb(244 247 247);"
        height="40px"
      >
        <el-space wrap>
          <el-switch
            size="small"
            active-text="自动模式"
            inactive-text="手动模式"
          />
          <el-button
            size="small"
            type="success"
            plain
          >
            开始
          </el-button>
          <el-button
            size="small"
            type="warning"
            plain
          >
            暂停
          </el-button>
          <el-button
            size="small"
            type="danger"
            plain
          >
            终止
          </el-button>
          <el-button
            size="small"
            type="primary"
            plain
            @click="nextStep()"
          >
            下一步
          </el-button>
        </el-space>
      </el-header>
      <el-main class="flow-content">
        <Transition name="slide-fade">
          <KeepAlive>
            <component
              :is="compName"
              v-if="activedFlowItem.nodeInfo != undefined"
              :key="activedFlowItem.nodeInfo.id"
              :container-id="activedFlowItem.nodeInfo.id"
              :flow-item="activedFlowItem"
              :meeting-id="meetingId"
              :status="activedFlowItem.status"
            />
          </KeepAlive>
        </Transition>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, onActivated } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElNotification } from 'element-plus'
import InputComp from './components/InputComp.vue'
import DiscussionComp from './components/DiscussionComp.vue'
import ThinkingComp from './components/ThinkingComp.vue'
import ProcessingComp from './components/ProcessingComp.vue';
import OutputComp from './components/OutputComp.vue';
import API from '@/api'
import { FlowItem, MeetingStatus } from '@/types/meeting';
import { NodeType } from '@/types/meeting-template';
import { useMeetingStore } from '@/store/meeting';

export default defineComponent({
  name: 'MeetingRecord',
  components: {
    InputComp,
    DiscussionComp,
    ThinkingComp,
    ProcessingComp,
    OutputComp
  },
  setup() {
    const meetingStore = useMeetingStore();
    const route = useRoute();
    const meetingId = ref('');
    const meetingName = ref('');
    let compName = ref('InputComp');
    let flow = ref([] as FlowItem[]);
    let nowStatus = ref('');
    let nowFlowItem = ref({} as FlowItem);
    let nextFlowItem = ref({} as FlowItem);
    let activedFlowItem = ref({} as FlowItem);
    let activedNum = ref(-1); // 当前激活

    const onSelect = (flowItem: FlowItem) => {
      console.log(flowItem)
      if (flowItem.status == 'wait') {
        ElMessage.warning('当前环节还没开始');
        return;
      }
      activedFlowItem.value = flowItem
      compName.value = flowItem.nodeInfo.nodeType + 'Comp';
    }

    const getProgress = async () => {
      const resp = await API.progress(meetingId.value);
      let result = resp.data
      if (result.code === 200) {
        const data = result.data
        flow.value = data.progress
        nowStatus.value = data.nowStatus
        nowFlowItem.value = data.nowFlowItem
        nextFlowItem.value = data.nextFlowItem
        meetingName.value = data.meetingName
        nextTick(() => {  // 需要放在后面，否则会导致active不能生效
          activedNum.value = data.activedNum
        })
      }
    }

    /**
     * 下一步
     */
    const nextStep = () => {
      // 获取下最新进度
      getProgress().then(() => {
        console.log(nextFlowItem.value);
        switch(nowStatus.value) {
          case MeetingStatus.DONE:
            ElNotification({
              'title': 'Warning',
              'message': '当前会议已结束',
              'type': 'warning'
            });
            break;
          case MeetingStatus.RUNNING:
            const nodeName = nowFlowItem.value.nodeInfo.nodeName
            ElNotification({
              'title': 'Warning',
              'message': '会议进行中，等待当前环节(' + nodeName + ')结束后再执行下一步',
              'type': 'warning'
            });
            doWork(nowFlowItem.value);
            break;
          case MeetingStatus.IDLE:
            doWork(nextFlowItem.value);
        }
      })
    }

    /**
     * 做工
     * @param flowItem 
     */
    const doWork = async (flowItem: FlowItem) => {
      if (flowItem == null) {
        ElNotification({
          'title': 'Error',
          'message': '获取执行环节错误',
          'type': 'error'
        });
        return;
      }
      // 确认开启当前环节
      const resp = await API.start({
        meetingId: meetingId.value,
        flowItemId: flowItem.nodeInfo.id
      });
      console.log(resp);
      let result = resp.data
      if (result.code !== 200) {
        ElNotification({
          'title': 'Error',
          'message': '开始失败',
          'type': 'error'
        });
        return;
      }

      activedFlowItem.value = flowItem
      activedNum.value
      const nodeInfo = flowItem.nodeInfo;
      switch(nodeInfo.nodeType) {
        case NodeType.Input:
          doInput();
          break;
        case NodeType.Thinking:
          doThink();
          break;
        case NodeType.Discussion:
          doDiscuss();
          break;
        case NodeType.Processing:
          doProcess();
          break;
        case NodeType.Output:
          doOutput();
          break;
      }
    }

    /**
     * 输入
     */
    const doInput = () => {
      compName.value = 'InputComp';
    }

    const doThink = () => {
      compName.value = 'ThinkingComp';
    }

    const doDiscuss = () => {
      compName.value = 'DiscussionComp';
    }

    const doProcess = () => {
      compName.value = 'ProcessingComp';
    }

    const doOutput = () => {
      compName.value = 'OutputComp';
    }

    onActivated(() => {
      getProgress();
    })

    onMounted(() => {
      console.log(route.query);
      meetingId.value = route.query.meetingId as string;
      if (meetingId.value === undefined || meetingId.value === '') { // 没获取到的话从store获取
        meetingId.value = meetingStore.getNowMeetingId();
        console.log('--' + meetingId.value)
      }
      if (meetingId.value === undefined || meetingId.value === '') {
        ElMessage.error('请选择会议～');
      } else {
        nextTick(() => {
          getProgress()
        })
      }
    })

    return {
      meetingId,
      meetingName,
      flow,
      nowStatus,
      compName,
      activedNum,
      activedFlowItem,
      nowFlowItem,
      nextFlowItem,
      onSelect,
      getProgress,
      nextStep
    }
  }
})
</script>

<style lang="scss" scoped>
.meeting {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

.aside {
  width: 250px;
  height: 100%;
  border-right: 1px solid rgb(244 247 247);
  display: flex;
  flex-direction: column;
}

.child-1 {
  width: 249px;
  height: 74px;
  padding: 10px;
  border-bottom: 1px solid rgb(244 247 247);

  .child-1-text {
    font-size: 28px;
  }
}

.meeting-agenda {
  flex: 1;
  overflow: auto;
  padding: 10px 0px 10px 10px;

  .item {
    border-radius: 4px;
    border: 1px solid;
    background-color: #ffffff;
    overflow: hidden;
    transition: .3s;
    padding: 10px;
    margin: 5px 5px 5px 0px;

    &:hover {
      cursor: pointer;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    }

    span {
      font-weight: bolder;
      text-decoration: underline;
    }

  }
}

.flow-content {
  // background-color: #f3f4f7;
  padding: 10px;
}
</style>
<style>
.el-step__description {
  padding-right: 0;
}

.el-step__title.is-finish,
.el-step__description.is-finish,
.el-step__head.is-finish {
  color: #748ffc;
}

.el-step__head.is-finish {
  border-color: #748ffc;
}

.el-step__title.is-process,
.el-step__description.is-process,
.el-step__head.is-process {
  color: #f56c6c;
}

.el-step__head.is-process {
  border-color: #f56c6c;
}

/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-fade-enter-active {
  transition: all 0.8s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.4s ease-out;
}

.slide-fade-enter-from {
  transform: translateY(150px);
  opacity: 1;
}
.slide-fade-leave-to {
  transform: translateY(-150px);
  opacity: 0;
}
</style>