<template>
  <div class="box-card">
    <el-tabs
      v-model="currentStep"
      tab-position="right"
      style="height: 100%;"
    >
      <el-tab-pane
        label="预设"
        name="presets"
      >
        <el-scrollbar>
          <div style="padding: 10px; height: 100%;">
            <el-divider content-position="left">
              完善预设信息
            </el-divider>
            <el-form
              label-width="80px"
              :disabled="disabled"
              :model="presets"
            >
              <el-form-item label="背景信息">
                <el-input
                  v-model="presets.background"
                  :autosize="{ minRows: 2, maxRows: 15 }"
                  type="textarea"
                  resize="none"
                />
              </el-form-item>
              <el-form-item label="当前环节">
                <el-input
                  v-model="presets.curFlowItemName"
                  :autosize="{ minRows: 2, maxRows: 2 }"
                  type="textarea"
                  resize="none"
                />
              </el-form-item>
              <el-form-item label="参与成员">
                <el-table
                  ref="memberTableRef"
                  :data="presets.memberList"
                  style="width: 100%"
                  row-key="memberId" 
                  table-layout="auto"
                  :show-overflow-tooltip="true"
                >
                  <el-table-column type="expand">
                    <template #default="props">
                      <div>
                        <span>名称</span>
                        <el-input
                          v-model="props.row.memberName"
                        />
                      </div>
                      <div>
                        <span>描述</span>
                        <el-input
                          v-model="props.row.description"
                          :autosize="{ minRows: 2, maxRows: 5 }"
                          type="textarea"
                          resize="none"
                        />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="名称"
                    prop="memberName"
                  />
                  <el-table-column
                    label="描述"
                    prop="description"
                  />
                  <el-table-column align="right">
                    <template #header>
                      <el-button
                        type="primary"
                        size="small"
                        @click="getRoleList()"
                      >
                        选成员
                      </el-button>
                      <el-button
                        size="small"
                        @click="handleAddMember()"
                      >
                        加成员
                      </el-button>
                    </template>
                    <template #default="scope">
                      <el-button
                        size="small"
                        @click="handleEditMember(scope.$index, scope.row)"
                      >
                        编辑
                      </el-button>
                      <el-button
                        size="small"
                        type="danger"
                        @click="handleDeleteMember(scope.$index, scope.row)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="开场语">
                <el-input
                  v-model="presets.prologuePrompt"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                  type="textarea"
                  resize="none"
                />
              </el-form-item>
              <el-form-item label="回答轮次">
                <el-input-number
                  v-model="presets.replyRound"
                  :min="1"
                  :max="5"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitPresets()"
                >
                  确认
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane
        label="讨论"
        name="discussion"
        :disabled="activedStep.indexOf('discussion') < 0"
      >
        <div class="chat-window">
          <!-- <div class="title-bar">
            {{ title }}
          </div> -->
          <div
            ref="chatArea"
            class="chat-area"
          >
            <div
              v-for="(message, index) in messages"
              :key="index"
              class="message"
              :class="{ 'self': message.isSelf }"
            >
              <div
                class="message-member"
                :class="{ 'self': message.isSelf }"
              >
                <el-avatar
                  v-if="message.isSelf"
                  shape="square"
                  :size="30"
                  src="https://image-1252487584.cos.ap-nanjing.myqcloud.com/meeting/1683020178090451.jpg"
                />
                <div
                  v-else
                  class="message-member-box"
                  :style="{'background-color': message.member.color}"
                  @click="atMember(message.member)"
                >
                  @
                </div>
                <div
                  class="message-info"
                  :class="{ 'self': message.isSelf }"
                >
                  <div>{{ message.member.memberName }}</div>
                  <div class="message-info-time">
                    {{ formatTime(message.time) }}
                  </div>
                </div>
              </div>
              <div
                class="message-content"
                :class="{ 'self': message.isSelf }"
              >
                <!-- {{ message.text }} -->
                <Markdown
                  :text="message.text"
                  :as-raw-text="false"
                />
              </div>
            </div>
          </div>
          <div class="discussion-send-area">
            <div
              v-if="atMemberList.length > 0"
              style="margin-bottom: 3px; padding: 0px 5px; align-self: flex-start;"
            >
              <el-tag
                v-for="member in atMemberList"
                :key="member.memberId"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="cancelAtMember(member)"
              >
                @{{ member.memberName }}
              </el-tag>
            </div>
            <div
              class="input-area"
              style="padding: 5px"
            >
              <el-input
                v-model="inputValue"
                type="textarea"
                placeholder="请输入消息"
                class="input-box"
                resize="none"
                :disabled="disabled"
                :autosize="{ minRows: 2, maxRows: 10 }"
              />
              <div class="btn-area">
                <el-button
                  type="primary"
                  size="small"
                  style="margin-bottom: 3px;"
                  :disabled="disabled"
                  @click="sendMessage(inputValue, atMemberList)"
                >
                  发送
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :disabled="disabled"
                  @click="submitDiscussion()"
                >
                  提交
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="总结"
        name="summary"
        :disabled="activedStep.indexOf('summary') < 0"
      >
        <el-scrollbar>
          <div style="padding: 10px; height: 100%;">
            <el-divider content-position="left">
              Summary Prompt
            </el-divider>
            <div class="content">
              <el-form
                :disabled="disabled"
                label-position="top"
              >
                <el-form-item label="AI人设">
                  <el-input
                    v-model="presets.summaryCharacters.description"
                    :autosize="{ minRows: 2 }"
                    type="textarea"
                    resize="none"
                  />
                </el-form-item>
                <el-form-item label="Prompt总结">
                  <el-input
                    v-model="presets.summaryPrompt"
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
                @click="summary()"
              >
                处理
              </el-button>
            </el-divider>
            <el-divider content-position="left">
              总结信息
            </el-divider>
            <Markdown
              :text="summaryText"
              :as-raw-text="false"
            />
            <el-divider content-position="right">
              <el-button
                type="danger"
                size="small"
                :disabled="disabled"
                @click="endDiscussion()"
              >
                完成
              </el-button>
            </el-divider>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-model="dialogVisible"
      modal
      width="80%"
      :show-close="false"
    >
      <template #header>
        <el-row>
          <el-col :span="8">
            <el-input
              v-model="roleSummary"
              placeholder="搜索"
              @keydown.enter="getRoleList()"
            />
          </el-col>
        </el-row>
      </template>
      <el-table
        :data="itemList"
        height="400"
        style="width: 100%;"
        @selection-change="handleSelectRole"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="名称"
          prop="summary"
          width="200"
        />
        <el-table-column
          label="描述"
          prop="description"
        />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="warning"
            plain
            @click="dialogVisible = false"
          >不选了</el-button>
          <el-button
            type="primary"
            plain
            @click="addSelectedMember()"
          >就这样</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

  
<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue';
import { ref } from 'vue';
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { Markdown } from '@/components'
import { DiscussionData, DiscussionPresets, FlowItem, Member, Message } from '@/types/meeting';
import { genRandomString } from '@/utils/index'
import API from '@/api';
import { formatTime } from '@/utils/index'
import { ElMessage, ElNotification } from 'element-plus'
import { RoleInfo, RoleList } from '@/types/role-template';


export default defineComponent({
  name: 'DiscussionComp',
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
    const title = '讨论';
    const messages = ref([] as Message[]);
    const messageIndexMap = ref(new Map<string, number>())
    const inputValue = ref('');
    const memberTableRef = ref(null);
    const presets = ref({summaryCharacters: {}} as DiscussionPresets);
    const discussionData = ref({} as DiscussionData);
    const memberList = ref([] as Member[]);
    const summaryText = ref('');
    const activedStep = ref(['presets']);
    const currentStep = ref('presets');
    const atMemberList = ref([] as Member[]);
    const disabled = ref(false);
    const roleSummary = ref('');
    const itemList = ref([] as RoleInfo[]);
    const dialogVisible = ref(false);
    const selectedRoleList = ref([] as RoleInfo[]);

    const getData = async () => {
      const resp = await API.getDiscussionData(props.meetingId, props.flowItem.nodeInfo.id);
      const result = resp.data
      if (result.code === 200) {
        discussionData.value = result.data!
        presets.value = discussionData.value.presets
      } else {
        console.log(result.msg);
      }
    }

    const handleAddMember = () => {
      console.log('add member')
      const member: Member = {
        memberId: genRandomString(8),
        memberName: '',
        description: '',
        color: ''
      }
      presets.value.memberList.push(member)
      memberTableRef.value.toggleRowExpansion(member)
    }

    const handleEditMember = (index: number, row: Member) => {
      if (memberTableRef.value) {
        memberTableRef.value.toggleRowExpansion(row)
      }
    }
    const handleDeleteMember = (index: number, row: Member) => {
      console.log(index, row)
      presets.value.memberList.splice(index, 1);
    }

    const getRoleList = async () => {
      let resp = await API.getRoleList({
        summary: roleSummary.value,
        pageNum: 1,
        pageSize: 20
      })
      let result = resp.data
      if (result.code === 200) {
        let roleList: RoleList = result.data!
        itemList.value = roleList.data
        dialogVisible.value = true
      }
    }

    const handleSelectRole = (roleList: RoleInfo[]) => {
      selectedRoleList.value = roleList
    }

    const addSelectedMember = () => {
      selectedRoleList.value.forEach((item) => {
        let isSame = false;
        presets.value.memberList.forEach((member) => {  // 相同的不重复添加
          if (member.memberId == item.id) {
            isSame = true;
            return;
          }
        });
        if (isSame) {
          return;
        }
        const member: Member = {
          memberId: item.id,
          memberName: item.summary,
          description: item.description,
          color: ''
        }
        presets.value.memberList.push(member)
      });
      dialogVisible.value = false;
    }

    const atMember = (member: Member) => {
      atMemberList.value.push(member);
    }

    const cancelAtMember = (member: Member) => {
      atMemberList.value.splice(atMemberList.value.indexOf(member), 1)
    }

    const submitPresets = () => {
      console.log('submitPresets');
      activedStep.value.push('discussion');
      currentStep.value = 'discussion';
      API.saveDiscussionPresets(presets.value)
        .then(function () {
          memberList.value = presets.value.memberList;
          // 分配下头像颜色
          for (let i = 0; i < memberList.value.length; i++) {
            memberList.value[i].color = getColor(i);
          }
          initDiscuss(presets.value.background, presets.value.prologuePrompt)
          discuss(presets.value.replyRound);
        }).catch(function(error) {
          console.log(error)
        })
    }

    // 初始化
    const initDiscuss = (background: string, prologuePrompt: string) => {
      const message: Message = {
        index: messages.value.length,
        id: genRandomString(16),
        text: background + prologuePrompt,
        isSelf: true,
        member: {
          memberId: 'user',
          memberName: 'User',
          color: '',
          description: ''
        },
        time: Date.now()/1000
      };
      messages.value.push(message); // 维持顺序
      messageIndexMap.value.set(message.id, message.index);  // 维持ID映射
      // 提交提问
      API.discussAndQuiz({
        meetingId: props.meetingId,
        flowItemId: props.flowItem.nodeInfo.id,
        text: prologuePrompt
      }).then(async function () {
        console.log('discuss and quiz');
      }).catch(function(error) {
        console.error(error)
      })
    }

    const discuss = async (replyRound: number) => {
      const url = '/api/meeting/discuss'
      for (let i = 0; i < replyRound; i++) {
        for (const member of memberList.value) {
          const message: Message = {
            index: messages.value.length,
            id: genRandomString(16),
            text: '',
            isSelf: false,
            member: member,
            time: Date.now()/1000
          };
          messages.value.push(message); // 维持顺序
          messageIndexMap.value.set(message.id, message.index);
          const param = {
            meetingId: props.meetingId,
            flowItemId: props.flowItem.nodeInfo.id,
            memberId: member.memberId
          }
          await sendAndReceive(url, message.id, param);
          console.log(`round: ${replyRound} memberId: ${member.memberId}`);
        }
      }
    }

    const submitDiscussion = () => {
      console.log('submit discussion');
      activedStep.value.push('summary');
      currentStep.value = 'summary';
    }

    const summary = () => {
      let param = {
        meetingId: props.meetingId,
        flowItemId: props.flowItem.nodeInfo.id,
        characters: presets.value.summaryCharacters.description,
        prompt: presets.value.summaryPrompt
      }
      const url = '/api/meeting/discussAndSummary'
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
              summaryText.value += ev.data;
            }
          },
          async onopen(response) {
            console.log('open summary')
            if (!response.ok || response.headers.get('content-type') !== EventStreamContentType) {
              ElMessage.error(response.statusText);
              throw new Error('open fail');
            }
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

    const endDiscussion = () => {
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


    // 发送消息
    const sendMessage = async (inputMsg: string, memberList: Member[]) => {
      if (inputMsg.trim() === '') {
        return;
      }
      // 没有指定某一个成员时则表示全部成员都需要回答
      if (memberList.length == 0) {
        memberList = presets.value.memberList
      } else {
        for(let member of memberList) {
          inputMsg += '@' + member.memberName + ' '
        }
      }
      const message: Message = {
        index: messages.value.length,
        id: genRandomString(16),
        text: inputMsg,
        isSelf: true,
        member: {
          memberId: 'user',
          memberName: 'User',
          color: '',
          description: ''
        },
        time: Date.now()/1000
      };
      messages.value.push(message); // 维持顺序
      messageIndexMap.value.set(message.id, message.index);  // 维持ID映射
      inputValue.value = '';
      atMemberList.value = [];
      // 提交提问
      API.discussAndQuiz({
        meetingId: props.meetingId,
        flowItemId: props.flowItem.nodeInfo.id,
        text: message.text
      }).then(async function () {
        console.log('discuss and quiz');
        // // 监听回复
        let param = {
          meetingId: props.meetingId,
          flowItemId: props.flowItem.nodeInfo.id
        }
        const url = '/api/meeting/discuss'
        for (const member of memberList) {
          const newMsg: Message = {
            index: messages.value.length,
            id: genRandomString(16),
            text: '',
            isSelf: false,
            member: member,
            time: Date.now()/1000
          };
          messages.value.push(newMsg);
          messageIndexMap.value.set(newMsg.id, newMsg.index);  // 维持ID映射
          param['memberId'] = member.memberId
          await sendAndReceive(url, newMsg.id, param);
        }
      }).catch(function(error) {
        console.log(error)
      });
    };

    const sendAndReceive = async (url: string, messageId: string, param: {}) => {
      const ctrl = new AbortController();
      await fetchEventSource(url, {
        method: 'POST',
        headers: API.getSettingWithCors(),
        body: JSON.stringify(param),
        signal: ctrl.signal,
        async onopen(response) {
          console.log('open')
          if (!response.ok || response.headers.get('content-type') !== EventStreamContentType) {
            ElMessage.error(response.statusText);
            throw new Error('open fail');
          }
        },
        onmessage(ev) {
          if (ev.event === 'chat') {
            if (ev.data == '') {  // 单独换行符
              ev.data = '\n';
            }
            const index = messageIndexMap.value.get(messageId);
            messages.value[index].text += ev.data;   // 追加到最后一个气泡
            // console.log(ev.id, ev.data);
            scrollToEnd();
          }
        },
        onclose() {
          const index = messageIndexMap.value.get(messageId);
          console.log(messages.value[index].text);
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

    const getColor = (index) => {
      const colorList = ['#FFC0CB', '#90EE90', '#ADD8E6', '#FF7F50', '#E6E6FA', '#D7D7D7', '#00FF7F', '#00CED1', '#1E90FF', '#EE82EE'];
      const length = colorList.length;
      return colorList[index%length];
    }

    // 重新加载历史记录
    const reloadChatRecord = (chatList: Message[]) => {
      chatList.forEach((chat) => {
        const index = messages.value.length;
        const member = chat.member
        member.color = getColor(index)
        const message: Message = {
          index: index,
          id: genRandomString(16),  // 服务端没存messageId，所以需要重新生成一个
          text: chat.text,
          isSelf: ['user', 'assistant', 'system'].includes(chat.member.memberName),
          member: chat.member,
          time: chat.time
        };
        messages.value.push(message); // 维持顺序
        messageIndexMap.value.set(message.id, message.index);
      })
    }

    onMounted(() => {
      console.log('mounted');
      console.log(props.meetingId)
      getData().then(() => {
        if (props.status == 'finish') {
          disabled.value = true;
          reloadChatRecord(discussionData.value.discussion.chatList);
          summaryText.value = discussionData.value.summary.summaryText;
          activedStep.value = ['presets', 'discussion', 'summary'];
        }
      })
    })

    return {
      title,
      messages,
      messageIndexMap,
      inputValue,
      memberTableRef,
      presets,
      summaryText,
      activedStep,
      currentStep,
      atMemberList,
      disabled,
      dialogVisible,
      roleSummary,
      itemList,
      selectedRoleList,
      sendMessage,
      scrollToEnd,
      handleAddMember,
      handleEditMember,
      handleDeleteMember,
      cancelAtMember,
      handleSelectRole,
      addSelectedMember,
      atMember,
      submitPresets,
      submitDiscussion,
      endDiscussion,
      summary,
      formatTime,
      getRoleList
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
}

.message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.message.self {
  // flex-direction: row-reverse;
  align-items: flex-end;
}

.message-member {
  // width: 30px;
  height: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.message-member.self {
  flex-direction: row-reverse;
  // align-items: flex-end;
}

.message-info {
  margin: 0px 10px;
  // color: gray;
  font-size: 14px;
}

.message-info.self {
  text-align: right;
}

.message-info-time {
  color: gray;
  font-size: 12px;
}

.message-content {
  display: inline-block;
  padding: 10px;
  border-radius: 5px;
  background-color: #f2f2f2;
  border: 1px solid #d1dbe582;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  max-width: 70%;
}

.message-content.self {
  background-color: #e7f8ff;
  color: #333;
}

.message-member-box {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  color: rgba(255, 255, 255, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    color: white;
    transition: 0.3;
  }
}

.discussion-send-area {
  align-items: flex-end;
  /* background-color: #f2f2f2; */
  border-top: 1px solid rgb(244, 247, 247);
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
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
  
<style>

.el-dialog__body {
  padding: 10px;
}
</style>