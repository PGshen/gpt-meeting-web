<!--
 * @Date: 2023-05-24 22:39:12
 * @LastEditors: peng pgs1108pgs@126.com
 * @LastEditTime: 2023-07-09 15:08:03
 * @FilePath: /gpt-meeting-service/Users/shen/Me/Code/plan/meeting-web/src/pages/meeting/components/ProcessingComp.vue
-->
<template>
  <div class="box-card">
    <el-divider content-position="left">
      Input Data
    </el-divider>
    <div class="content">
      <el-input
        v-model="inputData"
        :autosize="{ minRows: 2 }"
        type="textarea"
        :disabled="disabled"
        resize="none"
      />
    </div>
    <el-divider content-position="left">
      Process Prompt
    </el-divider>
    <div class="content">
      <el-form
        :disabled="disabled"
        label-position="top"
      >
        <el-form-item label="AI人设">
          <el-input
            v-model="characters"
            :autosize="{ minRows: 2 }"
            type="textarea"
            resize="none"
          />
        </el-form-item>
        <el-form-item label="Prompt处理">
          <el-input
            v-model="processingPrompt"
            :autosize="{ minRows: 2 }"
            type="textarea"
            resize="none"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-divider content-position="right">
      <el-button
        type="primary"
        size="small"
        :disabled="disabled"
        @click="process()"
      >
        通用处理
      </el-button>
    </el-divider>
    <el-divider content-position="left">
      Output Data
    </el-divider>
    <div class="content">
      <Markdown
        :as-raw-text="false"
        :text="outputData"
      />
    </div>
    <el-divider content-position="right">
      <el-button
        type="danger"
        size="small"
        :disabled="disabled"
        @click="endProcess()"
      >
        完成
      </el-button>
    </el-divider>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref } from 'vue'
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { Markdown } from '@/components'
import { FlowItem, ProcessingData } from '@/types/meeting';
import API from '@/api';
import { ElMessage, ElNotification } from 'element-plus'

export default defineComponent({
  name: 'ProcessingComp',
  components: {
    Markdown
  },
  props: {
    'flowItem': {
      type: Object as PropType<FlowItem>,
      required: true
    },
    'meetingId': {
      type: String,
      required: true
    },
    'status': {
      type: String,
      required: true
    }
  },
  setup(props) {
    const characters = ref('');
    const inputData = ref('');
    const processingPrompt = ref('');
    const outputData = ref('');
    const processingData = ref({} as ProcessingData);
    const disabled = ref(false);

    const getProcessingData = async () => {
      const resp = await API.getProcessingData(props.meetingId, props.flowItem.nodeInfo.id)
      const result = resp.data
      if (result.code === 200) {
        const data = result.data!
        processingData.value = data
        inputData.value = processingData.value.presets.background
        characters.value = processingData.value.presets.characters.description
        processingPrompt.value = processingData.value.presets.processingPrompt
      } else {
        console.log(result.msg);
      }
    }

    const process = () => {
      let param = {
        meetingId: props.meetingId,
        flowItemId: props.flowItem.nodeInfo.id,
        characters: characters.value,
        text: inputData.value,
        prompt: processingPrompt.value
      }
      outputData.value = 'thinking...';
      const url = '/api/meeting/process'
      const sendAndReceive = (url: string, param: {}) => {
        const ctrl = new AbortController();
        fetchEventSource(url, {
          method: 'POST',
          headers: API.getSettingWithCors(),
          body: JSON.stringify(param),
          signal: ctrl.signal,
          onmessage(ev) {
            if (ev.event === 'chat') {
              if (ev.data == '') {  // 单独换行符
                ev.data = '\n';
              }
              outputData.value += ev.data;
            }
          },
          async onopen(response) {
            outputData.value = '';
            if (!response.ok || response.headers.get('content-type') !== EventStreamContentType) {
              ElMessage.error(response.statusText);
              throw new Error('open fail');
            }
            console.log('open summary')
          },
          onclose() {
            console.log('close summary');
          },
          onerror(err) {
            console.log('error: ' + err);
            throw new Error(err);
          }
        });
      }
      sendAndReceive(url, param);
    }

    const endProcess = () => {
      console.log('end thinking');
      API.end({
        meetingId: props.meetingId,
        flowItemId: props.flowItem.nodeInfo.id
      }).then(function(resp) {
        let result = resp.data
        if (result.code !== 200) {
          ElNotification({
            'title': 'Error',
            'message': '提交完成失败',
            'type': 'error'
          });
          return;
        } else {
          ElNotification({
            'title': 'Success',
            'message': '当前环节完成～',
            'type': 'success'
          });
        }
      }).catch(function (error: any) {
        console.error(error)
      })
    }

    onMounted(() => {
      console.log('mounted');
      console.log(props.meetingId)
      getProcessingData().then(() => {
        if (props.status == 'finish') {
          disabled.value = true;
          outputData.value = processingData.value.output
        }
      })
    })

    return {
      inputData,
      characters,
      processingPrompt,
      outputData,
      disabled,
      process,
      endProcess
    }
  }
})
</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
  height: 100%;
  // padding: 20px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  overflow-y: auto;
  color: #303133;
  transition: 0.3;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  }
}

.content {
  padding: 10px;
}
</style>
