<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-12 10:23:59
 * @LastEditTime: 2023-07-09 15:09:19
-->
<template>
  <div class="parent">
    <div class="aside">
      <div class="child-1">
        <p class="child-1-text">
          GPT-Meeting
        </p>
        <el-text size="small">
          Communicate with GPT.
        </el-text>
      </div>
      <div class="child-3">
        <div
          v-for="{ id, title, componentName } in list"
          :key="id"
          :index="id"
          class="item"
          :class="{ 'actived': componentName == comName }"
          @click="openDetail(componentName)"
        >
          {{ title }}
        </div>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <component :is="comName" />
      </keep-alive>
      <!-- <tree-view :indent="20"></tree-view> -->
    </div>
  </div>
</template>
    
<script lang="ts">
import { defineComponent, ref } from 'vue';
import SettingComp from './components/SettingComp.vue'
import TempComp from './components/TempComp.vue'

export default defineComponent({
  name: 'SettingPage',
  components: {
    SettingComp,
    TempComp
  },
  setup() {
    let comName = ref('SettingComp');
    const list = [
      {
        id: 1,
        title: '基础设置',
        componentName: 'SettingComp'
      },
      {
        id: 5,
        title: '临时组件',
        componentName: 'TempComp'
      }
    ];

    const openDetail = (componentName: string) => {
      comName.value = componentName;
    }

    return {
      list,
      comName,
      openDetail
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
  height: 74px;
  padding: 10px;
  width: 249px;

  .child-1-text {
    font-size: 28px;
  }
}

.child-3 {
  flex: 1;
  padding: 10px;
  overflow: auto;
}

.item {
  padding: 8px;
  font-size: 16px;

  &:hover {
    background-color: rgba(161, 167, 192, 0.2);
    border-radius: 5px;
    cursor: pointer;
  }
}

.actived {
  background-color: rgba(161, 167, 192, 0.2);
  border-radius: 5px;
}


.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
  