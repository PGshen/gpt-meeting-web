<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-12 10:23:59
 * @LastEditTime: 2023-10-23 11:51:29
-->
<template>
  <div class="parent">
    <div class="aside">
      <div class="child-1">
        <p class="child-1-text">
          角色模版
        </p>
        <el-text size="small">
          定义参与会议的角色.
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
            @click="dialogFormVisible = true"
          >
            <Plus />
          </el-icon>
        </div>
      </div>
      <div class="child-3">
        <div
          v-for="item in roleTemplateList"
          :key="item.id"
          :index="item.id"
          class="role-item"
          @click="openRole(item)"
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
                {{ item.summary }}
              </el-text>
            </div>
          </div>
          <div>
            <el-icon @click.stop="unStarRole(item.id)">
              <Close />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <public-role-repo
      ref="publicRoleRepo"
      @refresh-my-role="refreshMyRole"
    />
  </div>

  <el-dialog
    v-model="dialogFormVisible"
    title="角色模版"
    modal
    width="80%"
  >
    <el-form label-width="80px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            label="头像"
          >
            <el-upload
              class="avatar-uploader"
              action="/api/resource/uploadimage"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="imageUrl"
                :src="imageUrl"
                class="avatar"
              >
              <el-icon
                v-else
                class="avatar-uploader-icon"
              >
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="角色概要"
          >
            <el-input
              v-model="summary"
              autocomplete="off"
              placeholder="概要描述关系特征"
            />
          </el-form-item>
          <el-form-item
            label="角色描述"
          >
            <el-input
              v-model="description"
              type="textarea"
              placeholder="详细描述角色的特征（你期望它所扮演的角色）"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          style="border-left: 1px dashed #dcdfe6;"
        >
          <el-form-item
            label="提问测试"
          >
            <el-input
              v-model="example"
              type="textarea"
              placeholder="提问测试看是否符合设定"
            />
          </el-form-item>
          <el-form-item
            label="角色回复"
          >
            <Markdown
              :text="reply"
              :as-raw-text="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="success"
          plain
          @click="testPrompt()"
        >测试</el-button>
        <el-button
          type="danger"
          plain
          @click="dialogFormVisible = false"
        >不要了</el-button>
        <el-button
          type="primary"
          plain
          @click="createRole()"
        >
          就这样
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
    
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { ElMessage, ElNotification } from 'element-plus'
import type { UploadProps } from 'element-plus'
import PublicRoleRepo from './components/PublicRoleRepo.vue'
import API from '@/api';
import { Markdown } from '@/components'
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { CreateRole, RoleInfo } from '@/types/role-template'
import { useRoleTemplateStore } from '@/store/role-template';

export default defineComponent({
  name: 'RoleTemplate',
  components: {
    PublicRoleRepo,
    Markdown
  },
  setup() {
    const roleStore = useRoleTemplateStore();
    let roleTemplateList = ref([] as RoleInfo[]);

    let publicRoleRepo = ref(null);
    let dialogFormVisible = ref(false);
    const formLabelWidth = '100px';

    let summary = ref('');
    let description = ref('');
    let example = ref('');
    let reply = ref('');

    const imageUrl = ref('')

    const handleAvatarSuccess: UploadProps['onSuccess'] = (
      response
    ) => {
      console.log(response);
      if (response.code === 200) {
        imageUrl.value = response.data.imageUrl
      }
      // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
      console.log(imageUrl.value)
    }

    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
      if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('Must be JPG or PNG format!')
        return false
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Size can not exceed 2MB!')
        return false
      }
      return true
    }

    const openRole = (item: RoleInfo) => {
      publicRoleRepo.value.openDetail(item);
    }

    const createRole = () => {
      if (imageUrl.value === '') {
        ElMessage.error('头像是必须的')
        return false
      }
      if (summary.value === '' || description.value === '') {
        ElMessage.error('角色概要和描述是必须的')
        return false
      }
      let createRoleInfo: CreateRole = {
        avatar: imageUrl.value,
        summary: summary.value,
        description: description.value,
        example: example.value,
        createdBy: '皮皮虾'
      }
      API.createRole(createRoleInfo)
        .then(function () {
          // 清除
          imageUrl.value = '';
          summary.value = '';
          description.value = '';
          example.value = '';
          ElNotification({
            title: 'Success',
            message: '创建角色成功～',
            type: 'success'
          })
        })
        .catch(function (error: any) {
          console.error(error)
        })
      dialogFormVisible.value = false
    }

    const testPrompt = () => {
      reply.value = '';
      let param = {
        message: '假如你是' + description.value + '。你需要将自己深度代入这个角色，不必解释其他的说明。我的问题是：' + example.value
      }
      const url = '/api/meeting/chat'
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
              reply.value += ev.data;
            }
          },
          async onopen(response) {
            console.log('open');
            if (!response.ok || response.headers.get('content-type') !== EventStreamContentType) {
              ElMessage.error(response.statusText);
              throw new Error('open fail');
            }
          },
          onclose() {
            console.log('close');
          },
          onerror(err) {
            console.log('error: ' + err);
            throw new Error(err);
          }
        });
      }
      sendAndReceive(url, param);
    }

    const unStarRole = (id: string) => {
      roleStore.removeMyTemplate(id)
      refreshMyRole()
      ElNotification({
        'title': 'Success',
        'message': '取消收藏成功～',
        'type': 'success'
      })
    }

    const refreshMyRole = () => {
      roleTemplateList.value = roleStore.getMyTemplateList()
    }

    onMounted(() => {
      roleTemplateList.value = roleStore.getMyTemplateList()
    })

    return {
      publicRoleRepo,
      roleTemplateList,
      dialogFormVisible,
      formLabelWidth,
      imageUrl,
      summary,
      description,
      example,
      reply,
      openRole,
      createRole,
      testPrompt,
      refreshMyRole,
      unStarRole,
      handleAvatarSuccess,
      beforeAvatarUpload
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
  