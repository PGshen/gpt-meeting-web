<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-13 10:30:12
 * @LastEditTime: 2023-07-02 16:21:03
-->
<template>
  <el-container>
    <el-header class="content-header">
      <h2 style="color: white;">
        Searching...
      </h2>
      <div class="search-box">
        <el-input
          v-model="summary"
          size="large"
          placeholder="Please input"
          @change="getRoleList()"
        >
          <template #append>
            <el-button
              icon="Search"
              @click="getRoleList()"
            />
          </template>
        </el-input>
      </div>
    </el-header>
    <el-main class="content-main">
      <div
        v-for="item in itemList"
        :key="item.id"
        style="width: 250px;"
        :index="item.id"
        class="role-item"
        @click="openDetail(item)"
      >
        <el-card :body-style="{ padding: '0px' }">
          <img
            :src="item.avatar"
            class="image"
            style="object-fit: cover;"
          >
          <div style="padding: 14px">
            <span class="multi-line1">{{ item.summary }}</span>
            <span class="multi-line2">{{ item.description }}</span>
            <div class="bottom">
              <span class="text-cls">Star: {{ item.starCount }}</span>
              <span class="text-cls">创建人: 皮皮虾</span>
            </div>
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
  <el-dialog
    v-model="dialogVisible"
    modal
    width="80%"
    :show-close="false"
    title="角色信息"
  >
    <el-descriptions
      :column="1"
      :border="true"
    >
      <el-descriptions-item
        label="头像"
        label-class-name="description-label"
      >
        <img
          :src="detailItem.avatar"
          style="height: 120px; display: inline-block; object-fit:cover;"
        >
      </el-descriptions-item>
      <el-descriptions-item label="角色概要">
        {{ detailItem.summary }}
      </el-descriptions-item>
      <el-descriptions-item label="角色描述">
        {{ detailItem.description }}
      </el-descriptions-item>
      <el-descriptions-item label="测试示例">
        {{ detailItem.example }}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="starRole(detailItem)">
          <el-icon><Star /></el-icon>&nbsp;收藏
        </el-button>
        <el-button @click="dialogVisible = false">知道了</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import API from '@/api';
import { RoleList, RoleInfo } from '@/types/role-template'
import { useRoleTemplateStore } from '@/store/role-template';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'PublicRoleRepo',
  emits: ['refreshMyRole'],
  setup(props, ctx) {
    const roleStore = useRoleTemplateStore();
    let summary = ref('');
    let id = ref('');
    let pageNum = ref(1);
    let pageSize = ref(20);
    let itemList = ref([] as RoleInfo[]);
    let dialogVisible = ref(false);
    let detailItem = ref({} as RoleInfo);

    const openDetail = (item: RoleInfo) => {
      dialogVisible.value = true;
      detailItem.value = item;
    }

    const starRole = (item: RoleInfo) => {
      roleStore.addMyTemplate(item);
      ctx.emit('refreshMyRole');
      dialogVisible.value = false;
      ElNotification({
        'title': 'Success',
        'message': '收藏成功~',
        'type': 'success'
      })
    }

    const getRoleList = async () => {
      let resp = await API.getRoleList({
        id: id.value,
        summary: summary.value,
        pageNum: pageNum.value,
        pageSize: pageSize.value
      })
      let result = resp.data
      if (result.code === 200) {
        let roleList: RoleList = result.data!
        itemList.value = roleList.data
      }
    }

    onMounted(() => {
      getRoleList()
    })

    return {
      dialogVisible,
      detailItem,
      id,
      summary,
      pageNum,
      itemList,
      openDetail,
      getRoleList,
      starRole
    }
  }
});
</script>

<style lang="scss" scoped>
.content-header {
  background-image: url(./../../../assets/bg03.jpg);
  background-size: cover;
  height: 200px;
  margin: 20px;
  border: 1px solid grey;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .search-box {
    width: 60%;
    margin-top: 5px;
    border-radius: 10px;
  }
}

.content-main {
  margin: 20px;
  padding: 0px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
}

.role-item {
  padding: 10px;
  flex: 1 1 auto;

  &:hover {
    background-color: rgba(161, 167, 192, 0.2);
    border-radius: 5px;
    cursor: pointer;
  }
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .text-cls {
    font-size: 12px;
    color: #999;
  }
}

.image {
  height: 120px;
  width: 100%;
  display: block;
}


.multi-line1 {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.multi-line2 {
  width: 100%;
  min-height: 40px;
  font-size: 14px;
  color: #999;
  font-weight: lighter;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.description-label {
  width: 200px;
}
</style>