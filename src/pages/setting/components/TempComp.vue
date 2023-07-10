<template>
  <div class="box-card">
    <div class="chat-window">
      <div class="title-bar">
        {{ title }}
      </div>
      <div
        ref="chatArea"
        class="chat-area"
      >
        <div
          v-for="(message, index) in messages"
          :id="message.id"
          :key="index"
          class="message-content"
        >
          <div class="message-question">
            <Markdown
              :text="message.question"
              :as-raw-text="false"
            />
          </div>
          <div class="message-answer">
            <Markdown
              :text="message.answer"
              :as-raw-text="false"
            />
          </div>
        </div>
      </div>
      <div class="send-area">
        <el-input
          v-model="inputValue"
          type="textarea"
          placeholder="Ctrl + Enter发送消息"
          class="input-box"
          resize="none"
          :autosize="{ minRows: 2, maxRows: 10 }"
          @keyup="sendByKeyUp"
        />
        <el-button
          color="#748ffc"
          plain
          class="send-button"
          @click="sendMessage()"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

  
<script lang="ts">
import { defineComponent, onUpdated } from 'vue';
import { ref } from 'vue';
import { ElInput, ElButton, ElMessage } from 'element-plus';
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { Markdown } from '@/components'
import { genRandomString } from '@/utils/index'
import API from '@/api';

export default defineComponent({
  name: 'TempComp',
  components: {
    ElInput,
    ElButton,
    Markdown
  },
  setup() {
    const title = '讨论';
    const messages = ref([]);
    const inputValue = ref('');
    // let obj = ref({});

    const sendByKeyUp = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        sendMessage();
      }
    }

    const sendMessage = () => {
      if (inputValue.value.trim() === '') {
        return;
      }
      const message = {
        id: genRandomString(6),
        question: inputValue.value,
        answer: 'thinking...'
      };
      console.log(message.question);
      messages.value.push(message);
      inputValue.value = '';
      // 监听回复
      let param = {
        message: message.question
      }
      const url = '/api/meeting/chat'
      sendAndReceive(url, param);
    };

    const sendAndReceive = (url: string, param: {}) => {
      const ctrl = new AbortController();
      fetchEventSource(url, {
        method: 'POST',
        headers: API.getSettingWithCors(),
        body: JSON.stringify(param),
        signal: ctrl.signal,
        async onopen(response) {
          if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
            console.log('open')
            let len = messages.value.length;
            messages.value[len - 1].answer = '';
          } else {
            ElMessage.error(response.statusText);
          }
        },
        onmessage(ev) {
          if (ev.event === 'chat') {
            let len = messages.value.length;
            if (ev.data == '') {  // 单独换行符
              ev.data = '\n';
            }
            messages.value[len - 1].answer += ev.data;   // 追加到最后一个气泡
            // console.log(ev.id, ev.data);
            scrollToEnd();
          }
        },
        onclose() {
          let len = messages.value.length;
          console.log(messages.value[len - 1].answer);
          console.log('close');
        },
        onerror(err) {
          console.log('error: ' + err);
          throw new Error(err);
        }
      });
    }

    const scrollToEnd = () => {
      const chatArea = document.querySelector('.chat-area');
      chatArea.scrollTop = chatArea.scrollHeight + 1200;
    };

    onUpdated(() => {
      // const boxes = document.querySelectorAll('.message-content');
      // boxes.forEach((box) => {
      //   if (box instanceof HTMLElement) {
      //     console.log(`MessageBox ${box.id} width: `, box.offsetWidth, ' height: ', box.offsetHeight);
      //   }
      // })
    })

    return {
      title,
      messages,
      inputValue,
      sendByKeyUp,
      sendMessage,
      scrollToEnd
    };
  }
});
</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
  height: 100%;
  // padding: 20px;
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

.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.title-bar {
  height: 40px;
  border-bottom: 1px solid rgb(244, 247, 247);
  text-align: center;
  line-height: 40px;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message-content {
  display: block;
  border-radius: 5px;
  border: 1px solid #d1dbe582;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  margin-bottom: 15px;
  max-width: 400px;
}

.message-content.self {
  background-color: #e7f8ff;
  color: #333;
}

.message-question {
  background-color: #5b8ff9;
  padding: 5px;
  color: #fff;
  border-radius: 4px 4px 0px 0px;
}

.message-answer {
  background-color: #fff;
  padding: 5px;
  border-radius: 0px 0px 4px 4px;
}

.send-area {
  display: flex;
  align-items: flex-end;
  /* background-color: #f2f2f2; */
  border-top: 1px solid rgb(244, 247, 247);
  padding: 10px;
}

.input-box {
  flex: 1;
  margin-right: 10px;
}

.send-button {
  width: 80px;
}
</style>
  