<!--
 * @Date: 2023-05-24 22:39:12
 * @LastEditors: peng pgs1108pgs@126.com
 * @LastEditTime: 2023-07-09 15:07:46
 * @FilePath: /gpt-meeting-service/Users/shen/Me/Code/plan/gpt-meeting-web/src/pages/meeting/components/OutputComp.vue
-->
<template>
  <div class="box-card">
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
        <el-form-item label="Prompt总结">
          <el-input
            v-model="summaryPrompt"
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
        @click="output()"
      >
        处理
      </el-button>
    </el-divider>
    <el-divider content-position="left">
      Output Data
    </el-divider>
    <div class="content">
      <Markdown
        :as-raw-text="false"
        :text="outputText"
      />
    </div>
    <el-divider content-position="right">
      <el-button
        type="danger"
        size="small"
        :disabled="disabled"
        @click="endOutput()"
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
import { FlowItem, OutputData } from '@/types/meeting';
import { ElMessage, ElNotification } from 'element-plus';
import API from '@/api';

export default defineComponent({
  name: 'OutputComp',
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
    const outputData = ref({} as OutputData)
    const characters = ref('');
    const summaryPrompt = ref('');
    const outputText = ref('');
    const disabled = ref(false);

    const getOutputData = async () => {
      const resp = await API.getOutputData(props.meetingId, props.flowItem.nodeInfo.id)
      const result = resp.data
      if (result.code === 200) {
        outputData.value = result.data!
        summaryPrompt.value = outputData.value.presets.summaryPrompt
        characters.value = outputData.value.presets.characters.description
      } else {
        console.log(result.msg);
      }
    }

    const output = () => {
      let param = {
        meetingId: props.meetingId,
        flowItemId: props.flowItem.nodeInfo.id,
        characters: characters.value,
        prompt: summaryPrompt.value
      }
      outputText.value = 'thinking...';
      const url = '/api/meeting/output'
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
              outputText.value += ev.data;
            }
          },
          async onopen(response) {
            console.log('open summary');
            if (!response.ok || response.headers.get('content-type') !== EventStreamContentType) {
              ElMessage.error(response.statusText);
              throw new Error('open fail');
            }
            outputText.value = '';
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

    const endOutput = () => {
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
      getOutputData().then(() => {
        if (props.status == 'finish') {
          disabled.value = true;
          outputText.value = outputData.value.output
        }
      })
    })

    return {
      summaryPrompt,
      outputText,
      characters,
      disabled,
      output,
      endOutput
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
