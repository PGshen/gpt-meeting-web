<!--
 * @Descripttion: 框架
 * @version: 
 * @Date: 2023-04-09 18:29:19
 * @LastEditTime: 2023-07-09 10:55:40
-->
<template>
  <el-container style="height: 100vh; overflow: hidden">
    <el-aside
      style="height: 100vh; background-color: #e5e9ea;"
      width="70px"
    >
      <div
        v-for="{ path, title, iconName } in menuList"
        :key="path"
        :index="path"
        class="menu-block"
      >
        <el-tooltip
          :content="title"
          placement="right"
          :show-after="500"
        >
          <span
            :class="{ 'selected': route.path == path }"
            class="menu-item"
            @click="handleNav(path)"
          >
            <el-icon
              color="#5b8ff9"
              style="margin-top: 5px;"
            >
              <component :is="iconName" />
            </el-icon>
            <span style="font-size: 8px; margin-top: 5px; color: #5b8ff9;">{{ title }}</span>
          </span>
        </el-tooltip>
      </div>
    </el-aside>
    <router-view />
  </el-container>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'AppPage',
  setup() {
    const menuList = ref([
      {
        path: '/setting',
        name: 'setting',
        title: '信息设置',
        iconName: 'Setting'
      },
      {
        path: '/meetingTemplate',
        name: 'meetingTemplate',
        title: '会议模版',
        iconName: 'Memo'
      },
      {
        path: '/roleTemplate',
        name: 'roleTemplate',
        title: '角色模版',
        iconName: 'User'
      },
      {
        path: '/',
        name: 'meeting',
        title: '会议管理',
        iconName: 'ChatLineSquare'
      },
      {
        path: '/meeting/meeting',
        name: 'meeting',
        title: '开会啦',
        iconName: 'VideoCamera'
      }
    ]);

    const router = useRouter();
    const route = useRoute();

    const handleNav = (path: string) => {
      console.log(path);
      router.push(path)
    }

    return {
      menuList,
      route,
      handleNav
    }
  }
});
</script>

<style lang="scss">
html {
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

body {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.menu-block {
  height: 70px;
  width: 100%;
  padding: 8px;

  .menu-item {
    background-color: #f0f0f2;
    border-radius: 15px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #bac8ff;
      cursor: pointer;
    }
  }
  
  .selected {
    background-color: #bac8ff;
    cursor: pointer;
  }
}
</style>