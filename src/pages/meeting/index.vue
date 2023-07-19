<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-09 18:29:19
 * @LastEditTime: 2023-07-19 09:35:56
-->
<template>
  <div class="parent">
    <div class="aside">
      <div class="child-1">
        <p class="child-1-text">
          Meeting
        </p>
        <el-text size="small">
          Communicate with GPT.
        </el-text>
      </div>
      <div
        class="child-2"
        @click="dialogFormVisible = true"
      >
        创建会议
      </div>
      <div class="child-3">
        <div
          v-for="item in itemList"
          :key="item.id"
          :index="item.id"
          class="meeting-item"
          @click="openMeeting(item)"
        >
          <el-text
            class="item-header"
            truncated
          >
            {{ item.name }}
          </el-text>
          <div class="item-footer">
            <div>{{ item.tokenCnt }} token</div>
            <div>{{ formatTime(item.createdTime) }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-container>
      <el-main>
        <div v-if="selectedMeetingId != ''">
          <el-descriptions
            title="会议纪要"
            :column="3"
          >
            <template #extra>
              <el-button
                link
                type="primary"
                @click="copy()"
              >
                <el-icon>
                  <DocumentCopy />
                </el-icon>
                &nbsp;Copy
              </el-button>
              <el-button
                link
                type="primary"
                @click="download()"
              >
                <el-icon>
                  <Download />
                </el-icon>
                &nbsp;Download
              </el-button>
            </template>
            <el-descriptions-item
              label="会议名称"
              :span="2"
            >
              {{ curMeeting.name }}
            </el-descriptions-item>
            <el-descriptions-item
              label="会议ID"
            >
              {{ curMeeting.id }}
            </el-descriptions-item>
            <el-descriptions-item label="会议时间">
              {{ formatTime(curMeeting.createdTime) }}
            </el-descriptions-item>
            <!-- <el-descriptions-item
              label="参会人员"
              :span="2"
            >
              {{ curMeeting.createdBy }}
            </el-descriptions-item> -->
            <!-- <el-descriptions-item label="token数">
              {{ curMeeting.tokenCnt }}
            </el-descriptions-item> -->
            <el-descriptions-item label="详情">
              <span
                style="color: #748ffc; cursor: pointer;"
                @click="gotoDetail(curMeeting.id)"
              >跳转</span>
            </el-descriptions-item>
          </el-descriptions>
          <el-divider content-position="left">
            主题&目标
          </el-divider>
          <div class="content">
            <Markdown :text="curMeeting.topicGoal" />
          </div>
          <el-divider content-position="left">
            概要
          </el-divider>
          <div class="content">
            <Markdown :text="curMeeting.overview" />
          </div>
          <el-divider content-position="left">
            最终结论
          </el-divider>
          <div class="content">
            <Markdown :text="curMeeting.conclusion" />
          </div>
        </div>
        <div v-else>
          <el-empty description="请选择会议" />
        </div>
      </el-main>
      <el-footer
        height="40px"
        class="footer"
      >
        <a
          href="https://github.com/PGshen"
          target="_blank"
        ><span style="color: #748ffc">ZERO-ZERO &copy; {{ new Date().getFullYear() }}</span></a>
      </el-footer>
    </el-container>
    <el-dialog
      v-model="dialogFormVisible"
      title="创建会议"
    >
      <el-form>
        <el-form-item label="会议模版">
          <el-select
            v-model="templateId"
            placeholder="选择模版"
            style="width: 100%"
          >
            <el-option
              v-for="item in meetingTemplateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-alert
            v-if="meetingTemplateList.length === 0"
            type="error"
            title="需收藏会议模版"
          />
        </el-form-item>
        <el-form-item label="会议名称">
          <el-input
            v-model="meetingName"
            type="textarea"
            placeholder="会议名称，表意"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="createMeeting()"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElNotification } from 'element-plus'
import { Markdown } from '@/components'
import { useMeetingTemplateStore } from '@/store/meeting-template';
import { MeetingTemplate } from '@/types/meeting-template';
import { Meeting, MeetingList, NewMeeting } from '@/types/meeting';
import API from '@/api';
import { formatTime } from '@/utils/index'
import { copyToClip } from '@/utils/copy'
import { useMeetingStore } from '@/store/meeting';

export default defineComponent({
  name: 'MeetingRecord',
  components: {
    Markdown
  },
  setup() {
    const router = useRouter();
    const meetingTemplateStore = useMeetingTemplateStore();
    const meetingStore = useMeetingStore();
    const pageNum = ref(1);
    const pageSize = ref(15);
    const selectedMeetingId = ref('');
    const dialogFormVisible = ref(false);
    const templateId = ref('');
    const meetingName = ref('');
    const meetingTemplateList = ref([] as MeetingTemplate[]);
    let itemList = ref([] as Meeting[]);
    let curMeeting = ref({} as Meeting);

    const createMeeting = () => {
      if (meetingName.value == '' || templateId.value == '') {
        ElMessage.error('会议模版和名称必填');
        return;
      }
      const meetingInfo: NewMeeting = {
        name: meetingName.value,
        templateId: templateId.value,
        createdBy: '皮皮虾'
      }
      API.newMeeting(meetingInfo)
        .then(function (response) {
          const resp = response.data;
          if (resp.code == 200) {
            ElNotification({
              title: 'Success',
              message: '创建会议成功～',
              type: 'success'
            });
            // 跳转至会议页
            console.log(resp.data);
            const meetingId = resp.data.meetingId;
            meetingStore.setNowMeetingId(meetingId);
            router.push({
              path: '/meeting/meeting',
              query: { meetingId: meetingId }
            })
          }
        })
        .catch(function (error: any) {
          console.error(error)
        });
      meetingName.value = '';
      templateId.value = '';
      dialogFormVisible.value = false
    }

    const openMeeting = (item: Meeting) => {
      curMeeting.value = item;
      selectedMeetingId.value = item.id;
    }

    const meetingHistory = async () => {
      const resp = await API.history({
        createdBy: '皮皮虾',
        pageNum: pageNum.value,
        pageSize: pageSize.value
      })
      let result = resp.data
      if (result.code === 200) {
        let meetingList: MeetingList = result.data!
        itemList.value = meetingList.data
      }
    }

    const copy = () => {
      const text = `# 主题&目标\n ${curMeeting.value.topicGoal} \n# 会议纪要\n ${curMeeting.value.overview} \n# 会议结论\n ${curMeeting.value.conclusion}`;
      copyToClip(text).then(() => {
        ElMessage.success('已复制～');
      });
    }

    const download = () => {
      const filename = curMeeting.value.name + '.md'
      const text = `# 主题&目标\n ${curMeeting.value.topicGoal} \n# 会议纪要\n ${curMeeting.value.overview} \n# 会议结论\n ${curMeeting.value.conclusion}`;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
    }

    const gotoDetail = (meetingId: string) => {
      console.log(meetingId);
      meetingStore.setNowMeetingId(meetingId);
      router.push('/meeting/meeting?meetingId=' + meetingId);
    }

    onMounted(() => {
      nextTick(() => {
        meetingTemplateList.value = meetingTemplateStore.getMyTemplateList();
        meetingHistory();
      })
    })
    return {
      itemList,
      selectedMeetingId,
      dialogFormVisible,
      templateId,
      meetingName,
      meetingTemplateList,
      curMeeting,
      meetingHistory,
      createMeeting,
      openMeeting,
      formatTime,
      download,
      copy,
      gotoDetail
    }
  }
});
</script>

<style lang="scss" scoped>
.parent {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

.aside {
  display: flex;
  flex-direction: column;
  height: 100%;
  // background-color: rgb(244 247 247);
  width: 250px;
  border-right: 1px solid rgb(244 247 247);
}

.child-1 {
  width: 249px;
  height: 74px;
  padding: 10px;

  .child-1-text {
    font-size: 28px;
  }
}

.child-2 {
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  border: 1px dashed #bac8ff;
  border-radius: 5px;
  padding: 10px;
  color: #748ffc;

  &:hover {
    border: 1px solid #bac8ff;
    background-color: #bac8ff;
    color: white;
    cursor: pointer;
  }
}

.child-3 {
  flex: 1;
  overflow: auto;
}

.meeting-item {
  margin: 10px;
  border: 1px solid #bac8ff;
  border-radius: 5px;
  padding: 10px;
  color: #748ffc;

  &:hover {
    border: 1px solid #4469fe;
    cursor: pointer;
  }
}

.meeting-item .item-header {
  font-size: 15px;
  font-weight: bolder;
  color: black;
  display: block;
}

.meeting-item .item-footer {
  display: flex;
  justify-content: space-between;
  color: #a6a6a6;
  font-size: 12px;
  margin-top: 8px;
}

.content {
  padding: 10px;
}

.footer {
  border-top: 1px solid rgb(244 247 247);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #748ffc;
}
</style>
