<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-12 10:23:59
 * @LastEditTime: 2023-07-02 16:17:22
-->
<template>
  <div class="parent">
    <div class="aside">
      <div class="child-1">
        <p class="child-1-text">
          会议模版
        </p>
        <el-text size="small">
          定义会议的流程模版.
        </el-text>
      </div>
      <div class="child-2">
        <div
          class="item"
        >
          公共模版库
        </div>
        <div class="item">
          <span>我的模版</span>
          <el-icon
            class="add-btn"
            @click="createTemplate()"
          >
            <Plus />
          </el-icon>
        </div>
      </div>
      <div class="child-3">
        <div
          v-for="item in meetingTemplateList"
          :key="item.id"
          :index="item.id"
          class="role-item"
          @click="openTemplate(item)"
        >
          <div style="flex-shrink: 1; width: 200px;">
            <div class="role-avatar">
              <el-avatar
                shape="square"
                :src="item.avatar"
              />
              <el-text
                truncated
                style="width: 140px; margin: 5px;"
              >
                {{ item.name }}
              </el-text>
            </div>
          </div>
          <div>
            <el-icon @click.stop="unStarTemplate(item.id)">
              <Close />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <public-meeting-repo
      @open-template="openTemplate"
    />
  </div>
  <el-drawer
    v-model="drawer"
    direction="btt"
    size="100%"
    :with-header="withHeader"
    :z-index="zIndex"
    append-to-body
  >
    <template #header>
      <h4>绘制流程模版</h4>
    </template>
    <template #default>
      <template-design
        ref="design"
        :cur-template="curTemplate"
        :is-edit="isEdit"
        :key="genRandomString(10)"
        @create-meeting-template-status="createStatus"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <span :hidden="isEdit">
          <el-button @click="starTemplate(curTemplate)">
            <el-icon><Star /></el-icon>&nbsp;收藏
          </el-button>
          <el-button @click="drawer = false">知道了</el-button>
        </span>
        <div :hidden="!isEdit">
          <el-button @click="cancelClick">
            不录了
          </el-button>
          <el-button
            type="primary"
            @click="confirmClick"
          >
            录完了
          </el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>
    
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { ElMessageBox, ElNotification } from 'element-plus';
import PublicMeetingRepo from './components/PublicMeetingRepo.vue'
import TemplateDesign from './components/TemplateDesign.vue'
import { useMeetingTemplateStore } from '@/store/meeting-template';
import { MeetingTemplate } from '@/types/meeting-template';
import { genRandomString } from '@/utils/index'

export default defineComponent({
  name: 'MeetingTemplate',
  components: {
    PublicMeetingRepo,
    TemplateDesign
  },
  setup() {
    const meetingStore = useMeetingTemplateStore();
    let design = ref(null);
    const drawer = ref(false);
    const isEdit = ref(true);
    const withHeader = ref(false);
    const zIndex = ref(1);
    const curTemplate = ref(new MeetingTemplate());

    const meetingTemplateList = ref([] as MeetingTemplate[]);

    /**
     * 创建新模版
     */
    const createTemplate = () => {
      curTemplate.value = null;    // 置空
      isEdit.value = true;
      drawer.value = true;
    }

    /**
     * 打开已有模版
     * @param id 
     */
    const openTemplate = (item: MeetingTemplate) => {
      curTemplate.value = item;
      isEdit.value = false;
      drawer.value = true;
    }

    const cancelClick = () => {
      ElMessageBox.confirm('修改将丢失，确定取消？', '', {cancelButtonText: '取消', confirmButtonText: '确定'})
        .then(() => {
          design.value.refreshTemplate(null);
          drawer.value = false;
        })
        .catch(() => {
          // catch error
        })
    }

    const starTemplate = (item: MeetingTemplate) => {
      meetingStore.addMyTemplate(item);
      meetingTemplateList.value = meetingStore.getMyTemplateList();
      ElNotification({
        'title': 'Success',
        'message': '收藏成功~',
        'type': 'success'
      })
    }

    const unStarTemplate = (id: string) => {
      meetingStore.removeMyTemplate(id);
      meetingTemplateList.value = meetingStore.getMyTemplateList();
      ElNotification({
        'title': 'Success',
        'message': '取消收藏成功～',
        'type': 'success'
      })
    }

    const confirmClick = () => {
      // 调用子组件的保存模版方法
      design.value.saveTemplate()
    }

    /**
     * 创建成功则关闭抽屉
     * @param status 
     */
    const createStatus = (status: boolean) => {
      if (status) {
        drawer.value = false;
        design.value.refreshTemplate(null);
        meetingTemplateList.value = meetingStore.getMyTemplateList();
      }
    }

    onMounted(() => {
      meetingTemplateList.value = meetingStore.getMyTemplateList();
    })

    return {
      design,
      drawer,
      withHeader,
      zIndex,
      meetingTemplateList,
      curTemplate,
      isEdit,
      openTemplate,
      createTemplate,
      cancelClick,
      confirmClick,
      createStatus,
      starTemplate,
      unStarTemplate,
      genRandomString
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
  padding: 10px;
}

.child-3 {
  flex: 1;
  padding: 0px 10px;
  overflow: auto;
}

.item {
  padding: 8px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover:not(:last-child) {
    background-color: rgba(161, 167, 192, 0.2);
    border-radius: 8px;
    cursor: pointer;
  }
}

.add-btn {
  &:hover {
    cursor: pointer;
    background-color: rgba(161, 167, 192, 0.2);
  }
}

.role-item {
  padding: 10px;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: rgba(161, 167, 192, 0.2);
    border-radius: 5px;
    cursor: pointer;
  }

  .role-avatar {
    display: flex;
    justify-content: flex-start;
    margin-right: 8px;
  }
}
</style>
<style>
.el-drawer__body {
  padding: 0px;
}
</style>
  