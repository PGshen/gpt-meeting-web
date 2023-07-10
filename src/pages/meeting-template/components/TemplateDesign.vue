<template>
  <div id="container">
    <div
      id="stencil"
      :hidden="!isEdit"
    />
    <TeleportContainer />
    <div id="graph-container" />
    <div id="info">
      <el-alert type="error" title="所有都必填"></el-alert>
      <el-collapse v-model="activeNames">
        <el-collapse-item
          title="模版信息"
          name="templateInfo"
        >
          <el-form
            label-position="top"
            :model="baseInfo"
            :disabled="!isEdit"
          >
            <el-form-item label="头像" required>
              <el-upload
                class="avatar-uploader"
                action="/api/resource/uploadimage"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="baseInfo.avatar"
                  :src="baseInfo.avatar"
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
            <el-form-item label="模版名称" required>
              <el-input
                v-model="baseInfo.templateName"
                placeholder="会议模版名字"
              />
            </el-form-item>
            <el-form-item label="模版描述" required>
              <el-input
                v-model="baseInfo.description"
                type="textarea"
                placeholder="详细描述这个会议模版的作用"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </el-form-item>
            <el-form-item label="用法示例" required>
              <el-input
                v-model="baseInfo.example"
                type="textarea"
                placeholder="举个该模版的使用示例"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item
          title="节点信息"
          name="nodeInfo"
          :hidden="!hasSelected"
        >
          <el-form
            label-position="top"
            :model="nodeInfo"
            :disabled="!isEdit"
          >
            <el-form-item label="节点类型">
              <el-tag>{{ nodeInfo.nodeType }}</el-tag>
            </el-form-item>
            <el-form-item label="节点名称" required>
              <el-input
                v-model="nodeInfo.nodeName"
                placeholder="当前节点名称，见名知意"
              />
            </el-form-item>
            <el-form-item
              v-if="['Input', 'Output', 'Thinking', 'Discussion', 'Processing'].includes(nodeInfo.nodeType)"
              label="AI人设"
              required
            >
              <el-select
                v-model="nodeInfo.characters"
                placeholder="Select"
                style="width: 100%"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.summary"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="['Thinking'].includes(nodeInfo.nodeType)"
              label="联想AI人设【Thinking专用】"
              required
            >
              <el-select
                v-model="nodeInfo.associationCharacters"
                placeholder="Select"
                style="width: 100%"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.summary"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="['Thinking'].includes(nodeInfo.nodeType)"
              label="提问AI人设【Thinking专用】"
              required
            >
              <el-select
                v-model="nodeInfo.quizCharacters"
                placeholder="Select"
                style="width: 100%"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.summary"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="['Discussion'].includes(nodeInfo.nodeType)"
              label="参与角色"
              required
            >
              <el-select
                v-model="nodeInfo.memberIds"
                multiple
                placeholder="Select"
                style="width: 100%"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.summary"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="['Input'].includes(nodeInfo.nodeType)"
              label="优化Prompt"
              required
            >
              <el-input
                v-model="nodeInfo.optimizationPrompt"
                type="textarea"
                placeholder="对输入进行优化"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </el-form-item>
            <el-form-item
              v-if="['Thinking', 'Discussion'].includes(nodeInfo.nodeType)"
              label="开场Prompt"
              required
            >
              <el-input
                v-model="nodeInfo.prologuePrompt"
                type="textarea"
                placeholder="当前节点的开场提示词"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </el-form-item>
            <el-form-item
              v-if="['Thinking'].includes(nodeInfo.nodeType)"
              label="提问Prompt"
              required
            >
              <el-input
                v-model="nodeInfo.quizPrompt"
                type="textarea"
                placeholder="当前节点的提问引导提示词"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </el-form-item>
            <el-form-item
              v-if="['Processing'].includes(nodeInfo.nodeType)"
              label="处理Prompt"
              required
            >
              <el-input
                v-model="nodeInfo.processingPrompt"
                type="textarea"
                placeholder="当前节点的提示词，对输入数据进行处理"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </el-form-item>
            <el-form-item
              v-if="['Thinking'].includes(nodeInfo.nodeType)"
              label="提问轮次"
              required
            >
              <el-input-number
                v-model="nodeInfo.quizRound"
                :min="1"
                :max="5"
              />
            </el-form-item>
            <el-form-item
              v-if="['Thinking'].includes(nodeInfo.nodeType)"
              label="提问个数"
              required
            >
              <el-input-number
                v-model="nodeInfo.quizNum"
                :min="1"
                :max="3"
              />
            </el-form-item>
            <el-form-item
              v-if="['Discussion'].includes(nodeInfo.nodeType)"
              label="回答轮次"
              required
            >
              <el-input-number
                v-model="nodeInfo.replyRound"
                :min="1"
                :max="3"
              />
            </el-form-item>
            <el-form-item
              v-if="['Output', 'Thinking', 'Discussion'].includes(nodeInfo.nodeType)"
              label="总结Prompt"
              required
            >
              <el-input
                v-model="nodeInfo.summaryPrompt"
                type="textarea"
                placeholder="当前节点的总结提示词"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, nextTick, onMounted, ref, toRaw, watch } from 'vue';
import { ElMessage, ElNotification } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { Graph, Path, Edge } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { Scroller } from '@antv/x6-plugin-scroller'
import { register, getTeleport } from '@antv/x6-vue-shape';
import MeetingNode from './MeetingNode.vue'
import { useRoleTemplateStore } from '@/store/role-template';
import { useMeetingTemplateStore } from '@/store/meeting-template'
import { MeetingTemplate, NodeType, TemplateBaseInfo, TemplateNodeInfo } from '@/types/meeting-template';
import API from '@/api';
import { RoleInfo } from '@/types/role-template';

const TeleportContainer = getTeleport();

export default defineComponent({
  name: 'TemplateDesign',
  components: {
    TeleportContainer
  },
  props: {
    'curTemplate': {
      type: [Object, null] as PropType<MeetingTemplate | null>,
      required: true,
      default: null
    },
    'isEdit': {
      type: Boolean,
      default: true
    }
  },
  emits: ['createMeetingTemplateStatus'],
  setup(props, ctx) {
    const roleStore = useRoleTemplateStore();
    const meetingStore = useMeetingTemplateStore();
    let graph: Graph;
    let baseInfo = ref({} as TemplateBaseInfo);
    let hasSelected = ref(false);
    let nodeInfo = ref({} as TemplateNodeInfo);
    let roleList = ref([] as RoleInfo[]);
    let activeNames = ref(['templateInfo']);

    watch(props, (newValue) => {
      let template: MeetingTemplate = toRaw(newValue.curTemplate);
      refreshTemplate(template);
    })

    // 上传头像成功
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
      if (response.code === 200) {
        baseInfo.value.avatar = response.data.imageUrl
      } else {
        ElMessage.error(response.msg)
      }
      console.log('avatar' + baseInfo.value.avatar)
    }

    // 上传头像之前
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

    // 初始化画布
    const initGraph = (): Graph => {
      // #region 初始化画布
      const graph: Graph = new Graph({
        container: document.getElementById('graph-container')!,
        grid: true,
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3
        },
        connecting: {
          snap: true,
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          sourceAnchor: {
            name: 'left',
            args: {
              dx: 8
            }
          },
          targetAnchor: {
            name: 'right',
            args: {
              dx: -8
            }
          },
          createEdge() {
            return graph.createEdge({
              shape: 'data-edge',
              zIndex: -1
            })
          },
          // 连接桩校验
          validateConnection({ sourceMagnet, targetMagnet }) {
            // 只能从输出链接桩创建连接
            if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
              return false
            }
            // 只能连接到输入链接桩
            if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
              return false
            }
            return true
          }
        },
        highlighting: {
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#31d0c6',
                strokeWidth: 4
              }
            }
          }
        }
      });

      graph.on('edge:mouseenter', ({ edge }) => {
        edge.addTools([
          {
            name: 'button-remove',
            args: {
              x: '30%',
              y: '50%'
            }
          }
        ])
      });
      graph.on('edge:mouseleave', ({ edge }) => {
        edge.removeTools([
          {
            name: 'button-remove'
          }
        ])
      });

      graph.on('node:added', ({ node }) => {
        console.log('add node: ' + node.id);
        let templateNode: TemplateNodeInfo = { 'id': node.id, 'nodeType': node.data.nodeType };
        meetingStore.addNode(node.id, templateNode)
      });

      graph.on('node:removed', ({ node }) => {
        console.log('remove node: ' + node.id);
        meetingStore.removeNode(node.id);
      });

      graph.on('node:selected', ({ node }) => {
        // todo 删除节点后保存移除store记录
        console.log('select node: ' + node);
        meetingStore.setSelectedNodeId(node.id);
        let currentNode = meetingStore.getCurrentNode();
        if (currentNode != undefined) {
          nodeInfo.value = currentNode;
          console.log(nodeInfo.value);
        }
        hasSelected.value = true;
      });

      graph.on('node:unselected', ({ node }) => {
        console.log('unselect node: ' + node.id);
        meetingStore.unsetSelectedNodeId();
        hasSelected.value = false;
      });


      // 使用插件
      graph
        .use(
          new Selection({
            multiple: true,
            rubberEdge: true,
            rubberNode: true,
            modifiers: 'shift',
            rubberband: true
          })
        )
        .use(new Snapline())
        .use(new Keyboard())
        .use(new Clipboard())
        .use(new History())
        .use(new Scroller());
      return graph;
    }

    // 是否存在环
    const isCyclic = (graph: Graph) => {
      let visited = new Set();
      let recStack = new Set();

      function isCyclicUtil(node) {
        if (!visited.has(node)) {
          visited.add(node);
          recStack.add(node);

          let neighbors = graph.getNeighbors(node, {outgoing: true});
          for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            if (!visited.has(neighbor) && isCyclicUtil(neighbor)) {
              return true;
            } else if (recStack.has(neighbor)) {
              // console.log(recStack, neighbor);
              return true;
            }
          }
        }
        recStack.delete(node);
        return false;
      }

      let nodes = graph.getNodes();
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (isCyclicUtil(node)) {
          return true;
        }
      }

      return false;
    }


    // 初始化侧边模版
    const initStencil = (graph: Graph) => {
      const stencil = new Stencil({
        title: '会议流程',
        target: graph,
        collapsable: true,
        groups: [
          {
            title: '会议节点',
            name: 'meeting-node',
            // graphHeight: 900,
            layoutOptions: {
              columns: 1,
              rowHeight: 110,
              marginX: 30
            }
          }
        ]
      })
      document.getElementById('stencil')!.appendChild(stencil.container);
      return stencil;
    }

    // 快捷键绑定
    const bindKey = (graph: Graph) => {
      // #region 快捷键与事件
      graph.bindKey(['meta+c', 'ctrl+c'], () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
          graph.copy(cells)
        }
        return false
      })
      graph.bindKey(['meta+x', 'ctrl+x'], () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
          graph.cut(cells)
        }
        return false
      })
      graph.bindKey(['meta+v', 'ctrl+v'], () => {
        if (!graph.isClipboardEmpty()) {
          const cells = graph.paste({ offset: 32 })
          graph.cleanSelection()
          graph.select(cells)
        }
        return false
      })

      // undo redo
      graph.bindKey(['meta+z', 'ctrl+z'], () => {
        if (graph.canUndo()) {
          graph.undo()
        }
        return false
      })
      graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
        if (graph.canRedo()) {
          graph.redo()
        }
        return false
      })

      // delete
      graph.bindKey('backspace', () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
          graph.removeCells(cells)
        }
      })

      // zoom
      graph.bindKey(['ctrl+1', 'meta+1'], () => {
        const zoom = graph.zoom()
        if (zoom < 1.5) {
          graph.zoom(0.1)
        }
      })
      graph.bindKey(['ctrl+2', 'meta+2'], () => {
        const zoom = graph.zoom()
        if (zoom > 0.5) {
          graph.zoom(-0.1)
        }
      })
    }

    // 根据节点的类型获取ports
    const getPortsByType = (type: NodeType, nodeId: string) => {
      let ports = []
      switch (type) {
        case NodeType.Input:
          ports = [
            {
              id: `${nodeId}-out`,
              group: 'out'
            }
          ]
          break
        case NodeType.Output:
          ports = [
            {
              id: `${nodeId}-in`,
              group: 'in'
            }
          ]
          break
        default:
          ports = [
            {
              id: `${nodeId}-in`,
              group: 'in'
            },
            {
              id: `${nodeId}-out`,
              group: 'out'
            }
          ]
          break
      }
      return ports
    }

    // 节点注册
    const registerNode = (graph: Graph, stencil: Stencil) => {
      register({
        shape: 'data-node',
        width: 150,
        height: 96,
        component: MeetingNode,
        // port默认不可见
        ports: {
          groups: {
            in: {
              position: 'left',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: 'transparent',
                  strokeWidth: 1,
                  fill: 'transparent'
                }
              }
            },
            out: {
              position: {
                name: 'right'
              },
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: 'transparent',
                  strokeWidth: 1,
                  fill: 'transparent'
                }
              }
            }
          }
        }
      });

      // 注册连线
      Graph.registerConnector(
        'curveConnector',
        (sourcePoint, targetPoint) => {
          const hgap = Math.abs(targetPoint.x - sourcePoint.x)
          const path = new Path()
          path.appendSegment(
            Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y)
          )
          path.appendSegment(
            Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y)
          )
          // 水平三阶贝塞尔曲线
          path.appendSegment(
            Path.createSegment(
              'C',
              sourcePoint.x < targetPoint.x
                ? sourcePoint.x + hgap / 2
                : sourcePoint.x - hgap / 2,
              sourcePoint.y,
              sourcePoint.x < targetPoint.x
                ? targetPoint.x - hgap / 2
                : targetPoint.x + hgap / 2,
              targetPoint.y,
              targetPoint.x - 6,
              targetPoint.y
            )
          )
          path.appendSegment(
            Path.createSegment('L', targetPoint.x + 2, targetPoint.y)
          )

          return path.serialize()
        },
        true
      )

      Edge.config({
        markup: [
          {
            tagName: 'path',
            selector: 'wrap',
            attrs: {
              fill: 'none',
              cursor: 'pointer',
              stroke: 'transparent',
              strokeLinecap: 'round'
            }
          },
          {
            tagName: 'path',
            selector: 'line',
            attrs: {
              fill: 'none',
              pointerEvents: 'none'
            }
          }
        ],
        connector: { name: 'curveConnector' },
        attrs: {
          wrap: {
            connection: true,
            strokeWidth: 10,
            strokeLinejoin: 'round'
          },
          line: {
            connection: true,
            stroke: '#A2B1C3',
            strokeWidth: 1,
            targetMarker: {
              name: 'classic',
              size: 6
            }
          }
        }
      })

      Graph.registerEdge('data-edge', Edge, true);
      const input = graph.createNode({
        shape: 'data-node',
        data: {
          nodeType: NodeType.Input,
          logoUrl: './input.svg',
          nodeName: '主题输入',
          description: '设定本次讨论的主题和目标'
        },
        ports: getPortsByType(NodeType.Input, 'input')
      });
      const thinking = graph.createNode({
        shape: 'data-node',
        data: {
          nodeType: NodeType.Thinking,
          logoUrl: './thinking.svg',
          nodeName: '联想思考',
          description: '不同角度,向不同方向,用不同方法或途径进行分析和提出方案'
        },
        ports: getPortsByType(NodeType.Thinking, 'thinking')
      });
      const discussion = graph.createNode({
        shape: 'data-node',
        data: {
          nodeType: NodeType.Discussion,
          logoUrl: './discussion.svg',
          nodeName: '主题讨论',
          description: '围绕主题和目标进行讨论'
        },
        ports: getPortsByType(NodeType.Discussion, 'discussion')
      });
      const common = graph.createNode({
        shape: 'data-node',
        data: {
          nodeType: NodeType.Processing,
          logoUrl: './common.svg',
          nodeName: '通用处理',
          description: '通用处理,按prompt对内容进行回答'
        },
        ports: getPortsByType(NodeType.Processing, 'processing')
      });
      const output = graph.createNode({
        shape: 'data-node',
        data: {
          nodeType: NodeType.Output,
          logoUrl: './output.svg',
          nodeName: '结论输出',
          description: '根据讨论的结果,输出最终的结论'
        },
        ports: getPortsByType(NodeType.Output, 'output')
      });
      stencil.load([input, discussion, thinking, common, output], 'meeting-node');

    }

    /**
     * 保存模版
     */
    const saveTemplate = () => {
      // 检查是否有环
      if (isCyclic(graph)) {
        ElMessage.error('流程图必须是无环图，请修改！');
        return;
      }
      if (graph.toJSON().cells.length < 1) {
        ElMessage.error('流程图空！')
        return;
      }
      let templateData = toRaw(meetingStore.templateNodeMap);
      let meetingTemplate = new MeetingTemplate();
      meetingTemplate.setAvatar(baseInfo.value.avatar);
      meetingTemplate.setTemplateName(baseInfo.value.templateName);
      meetingTemplate.setDescription(baseInfo.value.description);
      meetingTemplate.setExample(baseInfo.value.example);
      meetingTemplate.setStarCount(0);
      meetingTemplate.setTemplateFlow(graph.toJSON()); // 流程图
      meetingTemplate.setTemplateData(templateData);   // 节点数据
      meetingTemplate.setCreatedBy('皮皮虾呀');
      console.log(meetingTemplate);
      if (meetingTemplate.check(meetingTemplate).length > 0) {
        ElMessage.error('信息未填写完整');
        return;
      }
      API.updateMeetingTemplate(meetingTemplate)
        .then(function () {
          ElNotification({
            title: 'Success',
            message: '创建模版成功～',
            type: 'success'
          });
          ctx.emit('createMeetingTemplateStatus', true);
          return true;
        })
        .catch(function (error: any) {
          console.error(error);
          ctx.emit('createMeetingTemplateStatus', false);
          return false;
        })
        return true;
    }

    /**
     * 刷新模版
     * @param template 
     */
    const refreshTemplate = (template: MeetingTemplate) => {
      console.log(template);
      if (template == null) { // 创建新模版
        baseInfo.value = {
          'templateName': '',
          'avatar': '',
          'description': '',
          'example': ''
        }
        graph.options.interacting = true;
        graph.fromJSON([]);
        meetingStore.resetTemplate();
      } else {
        baseInfo.value = {
          'templateName': template.name,
          'avatar': template.avatar,
          'description': template.description,
          'example': template.example
        };
        let templateFlow = JSON.parse(template.templateFlow);
        graph.fromJSON(templateFlow);
        graph.options.interacting = false;  // 禁用交互
        meetingStore.restoreTemplate(template);
      }
    }

    // 初始化
    const init = () => {
      graph = initGraph();
      const stencil = initStencil(graph);
      bindKey(graph);
      registerNode(graph, stencil);
    }

    onMounted(() => {
      nextTick(() => {
        console.log('onMounted!')
        init();
        roleList.value = roleStore.getMyTemplateList(); // 当前用户收藏的角色列表
        refreshTemplate(toRaw(props.curTemplate));
      });
    });

    return {
      baseInfo,
      hasSelected,
      nodeInfo,
      roleList,
      activeNames,
      handleAvatarSuccess,
      beforeAvatarUpload,
      saveTemplate,
      refreshTemplate
    }
  }
});
</script>

<style lang="scss" scoped>
#container {
  height: 100%;
  width: 100%;
  display: flex;
  border-bottom: 1px solid #dfe3e8;
}

#stencil {
  width: 180px;
  height: 100%;
  position: relative;
  border-right: 1px solid #dfe3e8;
}

#graph-container {
  flex: 1;
}

#info {
  width: 300px;
  height: 100%;
  position: relative;
  right: 0px;
  padding: 10px;
  border-left: 1px solid #dfe3e8;
  overflow: auto;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  display: block;
}

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
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
<style>
.x6-widget-stencil {
  background-color: #fff;
}

.x6-widget-stencil-title {
  background-color: #fff;
}

.x6-widget-stencil-group-title {
  background-color: #fff !important;
}
</style>
