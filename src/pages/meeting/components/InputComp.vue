<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-05-19 20:02:19
 * @LastEditTime: 2023-07-09 15:08:36
-->
<template>
  <div class="box-card">
    <el-scrollbar>
      <el-form
        :disabled="disabled"
        label-position="top"
      >
        <el-form-item label="输入主题&目标">
          <el-input
            v-model="inputText"
            :autosize="{ minRows: 5, maxRows: 15 }"
            type="textarea"
            placeholder="Please input"
            resize="none"
          />
        </el-form-item>
        <el-form-item label="AI人设">
          <el-input
            v-model="characters"
            :autosize="{ minRows: 2 }"
            type="textarea"
            resize="none"
          />
        </el-form-item>
        <el-form-item label="Prompt优化">
          <el-input
            v-model="optimizationPrompt"
            :autosize="{ minRows: 2 }"
            type="textarea"
            resize="none"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="onSubmit(true)"
          >
            帮我优化
          </el-button>
          <el-button
            v-if="optimizedText == ''"
            type="success"
            plain
            @click="onSubmit(false)"
          >
            直接提交
          </el-button>
          <el-button
            v-if="optimizedSubmit"
            type="success"
            plain
            @click="onSubmit(false)"
          >
            没问题了,提交
          </el-button>
        </el-form-item>
        <el-form-item
          v-if="optimizedText != ''"
          label="优化后"
        >
          <el-input
            v-model="optimizedText"
            :autosize="{ minRows: 5 }"
            type="textarea"
            placeholder="Please input"
            resize="none"
          />  
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref } from 'vue';
import { ElMessage, ElNotification } from 'element-plus'
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { FlowItem, InputData } from '@/types/meeting'
import API from '@/api'

export default defineComponent({
  name: 'InputComp',
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
    const inputText = ref('');
    let optimizedText = ref('');
    let optimizedSubmit = ref(false);
    let disabled = ref(false);
    let characters = ref('');
    let optimizationPrompt = ref('');

    const getInputData = () => {
      API.getInputData(props.meetingId, props.flowItem.nodeInfo.id)
        .then(function(resp) {
          const result = resp.data
          if (result.code === 200) {
            const data: InputData = result.data!
            optimizationPrompt.value = data.presets.optimizationPrompt
            characters.value = data.presets.characters.description
            if (props.status == 'finish') {
              inputText.value = data.input
              optimizedText.value = data.output
            }
          } else {
            console.log(result.msg);
          }
        }).catch(function(error: any) {
          console.error(error)
        })
    }

    const onSubmit = async (isOptimized: boolean) => {
      let param = {
        meetingId: props.meetingId,
        flowItemId: props.flowItem.nodeInfo.id,
        characters: characters.value,
        prompt: optimizationPrompt.value,
        text: inputText.value
      }
      if (isOptimized) {
        optimizedText.value = 'thinking...'
        // 监听回复
        const url = '/api/meeting/input'
        sendAndReceive(url, param);
      } else {
        if (optimizedText.value != '') {
          param['text'] = optimizedText.value
        }
        // 提交数据
        let resp = await API.submitInput(param)
        if (resp.data.code !== 200) {
          ElNotification({
            'title': 'Error',
            'message': '提交Input失败',
            'type': 'error'
          });
          return;
        }
        // 确认结束当前环节
        resp = await API.end({
          meetingId: props.meetingId,
          flowItemId: props.flowItem.nodeInfo.id
        });
        let result = resp.data
        console.log(resp);
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
        disabled.value = true;
      }
    }

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
            optimizedText.value += ev.data;   // 追加到最后一个气泡
          }
        },
        async onopen(response) {
          if (!response.ok || response.headers.get('content-type') !== EventStreamContentType) {
            ElMessage.error(response.statusText);
            throw new Error('open fail');
          }
          optimizedText.value = '';
          optimizedSubmit.value = false;
        },
        onclose() {
          optimizedSubmit.value = true;
          console.log('close');
        },
        onerror(err) {
          console.log('error: ' + err);
          throw new Error(err);
        }
      });
    }

    onMounted(() => {
      console.log('mounted');
      console.log(props.meetingId)
      getInputData()
      if (props.status == 'finish') {
        disabled.value = true;
      }
    })

    return {
      inputText,
      optimizedText,
      optimizedSubmit,
      disabled,
      characters,
      optimizationPrompt,
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
  color: #303133;
  transition: 0.3;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  }
}

.content-box {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>