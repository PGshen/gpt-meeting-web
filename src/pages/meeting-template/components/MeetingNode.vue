<template>
  <div
    class="main-area"
    @mouseenter="onMainMouseEnter"
    @mouseleave="onMainMouseLeave"
  >
    <div class="main-info">
      <div style="display: flex; align-content: center;">
        <el-avatar
          shape="square"
          :size="25"
          :src="logoUrl"
          style="margin: 0 5px"
        />
        <el-text truncated>
          {{ nodeName }}
        </el-text>
      </div>
      <div
        class="more-action-container"
        @click="editDetail"
      >
        <i class="more-action" />
      </div>
    </div>
    <div class="desc-info">
      <span class="multi-line2">{{ description }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { NodeType } from '@/types/meeting-template';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MeetingNode',
  inject: ['getNode'],
  data() {
    return {
      plusActionSelected: false,
      nodeType: {
        type: NodeType,
        default: NodeType.Input
      },
      logoUrl: '',
      nodeName: '节点名称',
      description: '节点描述',
      NodeType
    };
  },
  mounted() {
    const node = (this as any).getNode();
    const { nodeType, logoUrl, nodeName, description } = node.getData();
    this.nodeType = nodeType;
    this.logoUrl = logoUrl;
    this.nodeName = nodeName;
    this.description = description;
  },
  methods: {
    editDetail() {
      const node = (this as any).getNode();
      console.log(node.id);
      console.log('click node')
    },

    // 鼠标进入矩形主区域的时候显示连接桩
    onMainMouseEnter() {
      const node = (this as any).getNode();
      // 获取该节点下的所有连接桩
      const ports = node.getPorts() || []
      ports.forEach((port: any) => {
        node.setPortProp(port.id, 'attrs/circle', {
          fill: '#fff',
          stroke: '#85A5FF'
        })
      })
    },

    // 鼠标离开矩形主区域的时候隐藏连接桩
    onMainMouseLeave() {
      const node = (this as any).getNode();
      // 获取该节点下的所有连接桩
      const ports = node.getPorts() || []
      ports.forEach((port: any) => {
        node.setPortProp(port.id, 'attrs/circle', {
          fill: 'transparent',
          stroke: 'transparent'
        })
      })
    }
  }
});
</script>

<style lang="scss" scoped>
.main-area {
  width: 150px;
  height: 96px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 3px;
  box-shadow: 0 -1px 4px 0 rgba(209, 209, 209, 50%), 1px 1px 4px 0 rgba(217, 217, 217, 50%);
  border-radius: 5px;
  border: 1px solid transparent;
  cursor: move;

  &:hover {
    border: 1px solid rgba(0, 0, 0, 10%);
    box-shadow: 0 -2px 4px 0 rgba(209, 209, 209, 50%), 2px 2px 4px 0 rgba(217, 217, 217, 50%);
  }
}

.main-info {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(209, 209, 209, 50%);
}

.desc-info {
  flex: 1 1 auto;
}

.more-action-container {
  margin: 0px 5px;
  width: 15px;
  height: 15px;
  text-align: center;
  cursor: pointer;
}

.more-action {
  display: inline-block;
  width: 3px;
  height: 15px;
  background: url('./../../../assets/original.png') no-repeat center center / 100% 100%;
}

.multi-line2 {
  width: 100%;
  font-size: 12px;
  line-height: 20px;
  // color: rgb(29, 29, 29);
  font-weight: lighter;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.x6-node-selected .main-area {
  border-color: #3471f9;
}
</style>