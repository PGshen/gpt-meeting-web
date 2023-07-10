<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-13 10:30:12
 * @LastEditTime: 2023-07-02 16:20:40
-->
<template>
  <el-container>
    <el-header class="content-header">
      <h2 style="color: white;">
        Searching...
      </h2>
      <div class="search-box">
        <el-input
          v-model="searchText"
          size="large"
          placeholder="Please input"
        >
          <template #append>
            <el-button 
              icon="Search"
              @click="getMeetingTemplateList"
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
        class="item"
        @click="openTemplate(item)"
      >
        <el-card :body-style="{ padding: '0px' }">
          <img
            :src="item.avatar"
            class="image"
            style="object-fit: cover;"
          >
          <div style="padding: 14px">
            <span class="multi-line1">{{ item.name }}</span>
            <span class="multi-line2">{{ item.description }}</span>
            <div class="bottom">
              <span class="text-cls">下载次数: {{ item.starCount }}</span>
              <span class="text-cls">创建人: 皮皮虾</span>
            </div>
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import API from '@/api';
import { MeetingTemplate, MeetingTemplateList } from '@/types/meeting-template';


export default defineComponent({
  name: 'PublicMeetingRepo',
  emits: ['openTemplate'],
  setup(props, ctx) {
    let searchText = ref('');
    let id = ref('');
    let pageNum = ref(1);
    let pageSize = ref(20);
    let itemList = ref([] as MeetingTemplate[]);

    /**
     * 
     * @param item 
     */
    const openTemplate = (item: MeetingTemplate) => {
      ctx.emit('openTemplate', item);
    }

    const getMeetingTemplateList =async () => {
      let resp = await API.getMeetingTemplateList({
        id: id.value,
        name: searchText.value,
        pageNum: pageNum.value,
        pageSize: pageSize.value
      })
      let result = resp.data
      if (result.code === 200) {
        let templateList: MeetingTemplateList = result.data!
        itemList.value = templateList.data
      }
    }

    onMounted(() => {
      getMeetingTemplateList()
    })

    return {
      searchText,
      itemList,
      openTemplate,
      getMeetingTemplateList
    }
  }
});
</script>

<style lang="scss" scoped>
.content-header {
  background-image: url(./../../../assets/bg02.jpeg);
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

.item {
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
  height: 100px;
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
</style>