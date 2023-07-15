<template>
  <div class="thinking-box-card">
    <el-tabs
      v-model="currentStep"
      tab-position="right"
      style="height: 100%;"
      @tab-change="rebuildGraph"
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
              label-width="100px"
              :model="presets"
              :disabled="disabled"
            >
              <el-form-item label="联想AI人设">
                <el-input
                  v-model="presets.associationCharacters.description"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                  type="textarea"
                  resize="none"
                />
              </el-form-item>
              <el-form-item label="提问AI人设">
                <el-input
                  v-model="presets.quizCharacters.description"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                  type="textarea"
                  resize="none"
                />
              </el-form-item>
              <el-form-item label="背景信息">
                <el-input
                  v-model="presets.background"
                  :autosize="{ minRows: 2, maxRows: 10 }"
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
              <el-form-item label="开场语">
                <el-input
                  v-model="presets.prologuePrompt"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                  type="textarea"
                  resize="none"
                />
              </el-form-item>
              <el-form-item label="风暴提问">
                <el-input
                  v-model="presets.quizPrompt"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  type="textarea"
                  resize="none"
                />
              </el-form-item>
              <el-form-item label="提问轮次">
                <el-input-number
                  v-model="presets.quizRound"
                  :min="1"
                  :max="5"
                />
              </el-form-item>
              <el-form-item label="提问个数">
                <el-input-number
                  v-model="presets.quizNum"
                  :min="1"
                  :max="3"
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
        label="思考"
        name="thinking"
        :disabled="activedStep.indexOf('thinking') < 0"
      >
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div
            :id="containerId"
            class="thinking-tree-area"
          />
          <div class="thinking-send-area">
            <div
              v-if="referNodeId != ''"
              style="margin-bottom: 3px;"
            >
              <el-alert
                type="info"
                :title="referConversation.question"
                :description="referConversation.answer"
                @close="cancelRefer()"
              />
            </div>
            <div class="input-area">
              <el-input
                v-model="inputValue"
                type="textarea"
                placeholder="请输入消息"
                class="input-box"
                resize="none"
                :autosize="{ minRows: 2, maxRows: 10 }"
                :disabled="disabled"
              />
              <div class="btn-area">
                <el-button
                  type="primary"
                  size="small"
                  style="margin-bottom: 3px;"
                  :disabled="disabled"
                  @click="sendMessage()"
                >
                  发送
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :disabled="disabled"
                  @click="submitThinking()"
                >
                  提交
                </el-button>
              </div>
            </div>
          </div>
          <!-- 隐藏不可见 -->
          <div style="position: absolute; left: -9999px; visibility: hidden;">
            <div
              v-for="(value) in conversationMap"
              :id="value[0]"
              :key="value[0]"
              class="thinking-message-content_hidden"
            >
              <div class="thinking-message-question">
                <Markdown
                  :text="value[1].question"
                  :as-raw-text="false"
                />
              </div>
              <div class="thinking-message-answer">
                <Markdown
                  :text="value[1].answer"
                  :as-raw-text="false"
                />
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
                @click="endThinking()"
              >
                完成
              </el-button>
            </el-divider>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, nextTick, onActivated, PropType, onUnmounted } from 'vue'
import G6, { TreeGraph } from '@antv/g6';
import { ref } from 'vue';
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { Markdown } from '@/components'
import { ElMessage, ElNotification } from 'element-plus'
import { genRandomString } from '@/utils/index'
import { FlowItem, ThinkingPresets, ThinkingTree, SimpleConversation, ThinkingData } from '@/types/meeting'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import API from '@/api';
// import { copyToClip } from '@/utils/copy'
import 'highlight.js/styles/github.css';

export default defineComponent({
  name: 'ThinkingComp',
  components: {
    Markdown
  },
  props: {
    'containerId': {
      type: String,
      default: 'container',
      required: true
    },
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
    let graph: TreeGraph = null;
    const conversationMap = ref(new Map<string, SimpleConversation>())
    const nodeIdStatusMap = new Map<string, string>(); // 节点状态映射 初始态init/提问中quizzing/已提问quizzed/回答中answering/已回答answered
    const inputValue = ref('');
    const pidValue = ref('');
    const referNodeId = ref('');
    const referConversation = ref({} as SimpleConversation);
    const presets = ref({associationCharacters: {}, quizCharacters: {}, summaryCharacters: {}} as ThinkingPresets);
    const thinkingData = ref({} as ThinkingData);
    const summaryText = ref('');
    const activedStep = ref(['presets']);
    const currentStep = ref('presets');
    const disabled = ref(false);
    const isRebuild = ref(false);

    // markdown 
    const mdi = new MarkdownIt({
      html: false,
      linkify: true,
      highlight(code, language) {
        const validLang = !!(language && hljs.getLanguage(language))
        if (validLang) {
          const lang = language ?? ''
          return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
        }
        return highlightBlock(hljs.highlightAuto(code).value, '')
      }
    })
    mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
    mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

    function highlightBlock(str: string, lang?: string) {
      return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">copy</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
    }
    // markdown end

    // interaction
    const getData = async () => {
      const resp = await API.getThinkingData(props.meetingId, props.flowItem.nodeInfo.id);
      const result = resp.data
      if (result.code === 200) {
        thinkingData.value = result.data!
        presets.value = thinkingData.value.presets
      }
    }
    // 提交预设信息
    const submitPresets = () => {
      console.log('submitPresets');
      activedStep.value.push('thinking');
      currentStep.value = 'thinking';
      // 保存presets
      API.saveThinkingPresets(presets.value)
        .then(function () {  
          const question = presets.value.background + presets.value.prologuePrompt;
          const nodeId = 'thinking';
          const thinkingData: ThinkingTree = {
            id: nodeId,
            parentId: '',
            question: question,
            answer: '',
            width: 380,
            height: 62,
            collapsed: false,
            children: []
          };
          // 初始化树
          nextTick(() => {
            const conversation:SimpleConversation = {
              id: nodeId,
              question: question,
              answer: 'thinking...'
            };
            console.log('thinking', conversation.question);
            conversationMap.value.set(nodeId, conversation);
            initGraph(thinkingData);
            nextTick(() => {
              answer('thinking', question, presets.value.quizRound, presets.value.quizNum);
            })
          })
        })
        .catch(function (error: any) {
          console.error(error)
        })
    }

    // 主动提问
    const sendMessage = () => {
      if (inputValue.value.trim() === '' || referNodeId.value.trim() === '') {
        return;
      }
      
      if (nodeIdStatusMap.get(referNodeId.value) == undefined) {
        console.log('pid not found')
        return;
      }
      const nodeId = genRandomString(16);
      const parentNodeId = referNodeId.value;
      const conversation:SimpleConversation = {
        id: nodeId,
        question: inputValue.value,
        answer: 'thinking...'
      };
      console.log(nodeId, conversation);
      conversationMap.value.set(nodeId, conversation);
      // 增加子节点
      addSubNode(nodeId, referNodeId.value, inputValue.value);
      inputValue.value = '';
      referNodeId.value = '';
      // 监听回复
      nextTick(() => {
        const answerUrl = '/api/meeting/thinkAndAnswer';
        const param = {
          meetingId: props.meetingId,
          flowItemId: props.flowItem.nodeInfo.id,
          chatTreeNodeId: nodeId,
          chatTreeParentNodeId: parentNodeId,
          text: conversation.question
        }
        sendAndReceive(nodeId, answerUrl, param, 'answer', 0, 0);
      })
    };

    /**
     * 基于历史问答进行提问
     * @param nodeId 
     * @param parentNodeId 
     */
    const quiz = (nodeId: string, parentNodeId: string, quizRound: number, quizNum: number) => {
      if (nodeId == '' && parentNodeId != '') { // 创建新的字节点
        nodeId = genRandomString(16);
        const conversation:SimpleConversation = {
          id: nodeId,
          question: 'thinking...',
          answer: 'thinking...'
        };
        console.log(nodeId, conversation);
        conversationMap.value.set(nodeId, conversation);
        // 增加子节点
        addSubNode(nodeId, parentNodeId, '');
      } else {  // 跟节点
        const conversation:SimpleConversation = {
          id: nodeId,
          question: 'thinking...',
          answer: 'thinking...'
        };
        console.log(nodeId, conversation.question);
        conversationMap.value.set(nodeId, conversation);
      }
      nextTick(() => {
        const quizUrl = '/api/meeting/thinkAndQuiz';
        const param = {
          meetingId: props.meetingId,
          flowItemId: props.flowItem.nodeInfo.id,
          chatTreeNodeId: nodeId,
          chatTreeParentNodeId: parentNodeId
        }
        sendAndReceive(nodeId, quizUrl, param, 'question', quizRound, quizNum);
      })
    }

    /**
     * 回答问题
     * @param nodeId 
     * @param question 
     */
    const answer = (nodeId: string, question: string, quizRound: number, quizNum: number) => {
      const answerUrl = '/api/meeting/thinkAndAnswer';
      const param = {
        meetingId: props.meetingId,
        flowItemId: props.flowItem.nodeInfo.id,
        chatTreeNodeId: nodeId,
        chatTreeParentNodeId: '',
        text: question
      }
      sendAndReceive(nodeId, answerUrl, param, 'answer', quizRound, quizNum);
    }

    /**
     * 发送并接收
     * @param nodeId 
     * @param url 
     * @param param 
     * @param type 
     */
    const sendAndReceive = (nodeId: string, url: string, param: {}, type: string, quizRound: number, quizNum: number) => {
      const ctrl = new AbortController();
      const nodeElem = document.getElementById(nodeId);
      console.log(nodeElem);
      fetchEventSource(url, {
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
          let message = conversationMap.value.get(nodeId);
          message[type] = '';
          conversationMap.value.set(nodeId, message);
          nodeIdStatusMap.set(nodeId, type === 'question' ? 'quizzing' : 'answering');
          updateNode(nodeId, nodeElem.offsetWidth, nodeElem.offsetHeight, type, '');
        },
        onmessage(ev) {
          if (ev.event === 'chat') {
            if (ev.data == '') {  // 单独换行符
              ev.data = '\n';
            }

            let message = conversationMap.value.get(nodeId)
            message[type] += ev.data;
            nextTick(() => {
              // console.log('width: ' + nodeElem.offsetWidth + ' height: ' + nodeElem.offsetHeight + ' message: ' + message[type]);
              updateNode(nodeId, nodeElem.offsetWidth, nodeElem.offsetHeight, type, message[type]);
            })
          }
        },
        onclose() {
          nodeIdStatusMap.set(nodeId, type === 'question' ? 'quizzed' : 'answered');
          const words = conversationMap.value.get(nodeId)[type];
          console.log(words);
          console.log('close');
          if(type === 'question') {
            answer(nodeId, words, quizRound, quizNum);
          } else if (type === 'answer' && quizRound > 0) {
            quizRound--;
            for(let i = 0; i < quizNum; i++) {
              quiz('', nodeId, quizRound, quizNum);
            }
          }
        },
        onerror(err) {
          console.log('error: ' + err);
          throw new Error(err);
        }
      });
      console.log('here!');
    }

    /**
     * 追问
     * @param nodeId 
     */
    const questionClosely = (nodeId: string) => {
      console.log('question closely');
      referNodeId.value = nodeId;
      referConversation.value = conversationMap.value.get(nodeId)
    }

    const cancelRefer = () => {
      referNodeId.value = '';
      referConversation.value = {} as SimpleConversation
    }

    /**
     * 重新回答
     * @param nodeId 
     */
    const answerAgain = (nodeId: string) => {
      console.log('answer again');
      answer(nodeId, '', 0, 0);
    }

    const submitThinking = () => {
      console.log('submit thinking');
      activedStep.value.push('summary');
      currentStep.value = 'summary';
    }

    // 总结
    const summary = () => {
      let param = {
        meetingId: props.meetingId,
        flowItemId: props.flowItem.nodeInfo.id,
        characters: presets.value.summaryCharacters.description,
        prompt: presets.value.summaryPrompt
      }
      const url = '/api/meeting/thinkAndSummary'
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
            console.log('open summary');
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

    const endThinking = () => {
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
    // interaction end

    // graph operate
    const defaultConfig = {
      padding: [20, 50],
      defaultLevel: 3,
      defaultZoom: 0.8,
      modes: {
        default: ['drag-canvas', 'scroll-canvas', 'drag-node']
      },
      fitView: false,
      animate: true,
      defaultNode: {
        type: 'flow-rect'
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          stroke: '#5c5b5b'
        }
      }
    };

    // 自定义节点、边
    const registerFn = () => {
      /**
       * 自定义节点
       */
      G6.registerNode(
        'flow-rect',
        {
          shapeType: 'flow-rect',
          draw(cfg, group) {
            // console.log('draw')
            const {
              id = '',
              question = '',
              answer = '',
              width = 380,
              height = 62,
              collapsed
            } = cfg;
            const mdQuestion = mdi.render(question as string);
            const mdAnswer = mdi.render(answer as string);

            const rect = group.addShape('dom', {
              attrs: {
                width: width as number,
                height: height as number,
                // 传入 DOM 的 html
                html: `<div class="thinking-message">
                        <div class="thinking-message-content">
                          <div class="thinking-message-actions">
                            <div class="thinking-message-button aa" id="aa-${id}" onclick="answerAgain('${id}')">重答</div>
                            <div class="thinking-message-button qc" id="qc-${id}" onclick="questionClosely('${id}')">追问</div>
                          </div>
                          <div class="thinking-message-question">
                            <div class="markdown-body">
                              ${mdQuestion}
                            </div>
                          </div>
                          <div class="thinking-message-answer">
                            <div class="markdown-body">
                              ${mdAnswer}
                            </div>
                          </div>
                        </div>
                      </div>`
              },
              name: 'dom-node-keyShape',  // 在 G6 3.3 及之后的版本中，必须指定 name，可以是任意字符串，但需要在同一个自定义元素类型中保持唯一性
              draggable: true
            });
            // collapse rect
            if (cfg.children && (cfg.children as ThinkingTree[]).length) {
              group.addShape('rect', {
                attrs: {
                  x: width as number - 38,
                  y: - 8,
                  width: 16,
                  height: 16,
                  stroke: 'rgba(0, 0, 0, 0.25)',
                  cursor: 'pointer',
                  fill: '#fff'
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: 'collapse-back',
                modelId: cfg.id
              });

              // collpase text
              group.addShape('text', {
                attrs: {
                  x: width as number - 30,
                  y: - 1,
                  textAlign: 'center',
                  textBaseline: 'middle',
                  text: collapsed ? '+' : '-',
                  fontSize: 16,
                  cursor: 'pointer',
                  fill: 'rgba(0, 0, 0, 0.25)'
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: 'collapse-text',
                modelId: cfg.id
              });
            }

            // this.drawLinkPoints(cfg, group);
            return rect;
          },
          update(cfg, item) {
            // console.log('update: ', cfg);
            const group = item.getContainer();
            let domNode = group.find(ele => ele.get('name') === 'dom-node-keyShape');
            const {
              id = '',
              question = '',
              answer = '',
              width = 380,
              height = 62,
              collapsed
            } = cfg;
            const mdQuestion = mdi.render(question as string);
            const mdAnswer = mdi.render(answer as string);
            domNode.attr({
              width: width,
              height: height,
              html: `<div class="thinking-message">
                        <div class="thinking-message-content">
                          <div class="thinking-message-actions actions-display">
                            <div class="thinking-message-button aa" id="aa-${id}" onclick="answerAgain('${id}')">重答</div>
                            <div class="thinking-message-button qc" id="qc-${id}" onclick="questionClosely('${id}')">追问</div>
                          </div>
                          <div class="thinking-message-question">
                            <div class="markdown-body">
                              ${mdQuestion}
                            </div>
                          </div>
                          <div class="thinking-message-answer">
                            <div class="markdown-body">
                              ${mdAnswer}
                            </div>
                          </div>
                        </div>
                      </div>`
            })
            if (cfg.children && (cfg.children as ThinkingTree[]).length) {
              group.addShape('rect', {
                attrs: {
                  x: width as number - 38,
                  y: - 8,
                  width: 16,
                  height: 16,
                  stroke: 'rgba(0, 0, 0, 0.25)',
                  cursor: 'pointer',
                  fill: '#fff'
                },
                name: 'collapse-back',
                modelId: cfg.id
              });

              // collpase text
              group.addShape('text', {
                attrs: {
                  x: width as number - 30,
                  y: - 1,
                  textAlign: 'center',
                  textBaseline: 'middle',
                  text: collapsed ? '+' : '-',
                  fontSize: 16,
                  cursor: 'pointer',
                  fill: 'rgba(0, 0, 0, 0.25)'
                },
                name: 'collapse-text',
                modelId: cfg.id
              });
            }
          },
          setState(name, value, item) {
            if (name === 'collapse') {
              const group = item.getContainer();
              const collapseText = group.find((e) => e.get('name') === 'collapse-text');
              if (collapseText) {
                if (!value) {
                  collapseText.attr({
                    text: '-'
                  });
                } else {
                  collapseText.attr({
                    text: '+'
                  });
                }
              }
            }
          },
          getAnchorPoints() {
            return [
              [0, 0],
              [0.92, 0]
            ];
          }
        },
        'rect'
      );
    };

    const initGraph = (data: ThinkingTree) => {
      if (!data) {
        return;
      }
      graph = new G6.TreeGraph({
        container: props.containerId,
        renderer: 'svg',
        ...defaultConfig,
        layout: {
          type: 'indented',
          direction: 'LR',
          dropCap: false,
          indent: 480,
          getId: function getId(node: any) {
            return node.id;
          },
          getHeight: (node: any) => {
            return node.height > 200 ? node.height : 200;
          },
          getWidth: () => {
            return 380;
          },
          getHGap: () => 40
        }
      });
      graph.data(data);
      graph.render();
      // 初始节点状态
      nodeIdStatusMap.set(data.id, 'init');

      const handleCollapse = (e) => {
        const target = e.target;
        const id = target.get('modelId');
        const item = graph.findById(id);
        const nodeModel = item.getModel();
        nodeModel.collapsed = !nodeModel.collapsed;
        graph.layout();
        graph.setItemState(item, 'collapse', (nodeModel.collapsed as boolean));
      };
      graph.on('collapse-text:click', (e) => {
        handleCollapse(e);
      });
      graph.on('collapse-back:click', (e) => {
        handleCollapse(e);
      });
      return graph;
    }

    /**
     * 添加子节点
     * @param nodeId 节点ID
     * @param pid 父节点ID
     * @param question 问题
     */
    const addSubNode = (nodeId: string, pid: string, question: string) => {
      const data = {
        id: nodeId,
        parentId: pid,
        question: question,
        answer: 'thinking...',
        width: 380,
        height: 62,
        collapsed: false,
        children: []
      };
      graph.addChild(data, pid);
    }

    /**
     * 更新节点
     * @param id 
     * @param answer
     */
    const updateNode = (id: string, width: number, height: number, type: string, words: string) => {
      const node = graph.findById(id);
      // console.log(node)
      const oldHeight = node._cfg.model.height as number;
      // node._cfg.model.width = width;
      node._cfg.model.height = height;
      if (type != '') {
        node._cfg.model[type] = words;
      }
      // node._cfg.model.answer = node._cfg.model.answer + answerWords;
      graph.refreshItem(node);
      if (height > oldHeight) { // 高度变高
        graph.layout();
      }
    }

    // graph operate end
    const rebuildGraph = (tabName: string) => {
          // 第一次打开tab时加载树然后渲染
       if (!isRebuild.value &&  props.status == 'finish' && tabName == 'thinking') {
        const thinkingTree = thinkingData.value.thinking.thinkingTree;
        nextTick(() => {  // 保证数据已经渲染
          updateHeight(thinkingTree);
          // console.log(thinkingTree)
          initGraph(thinkingTree);
        })
        isRebuild.value = true;
       }
    }

    const updateHeight = (thinkingTree: ThinkingTree) => {
      const nodeId = thinkingTree.id
      const nodeElem = document.getElementById(nodeId);
      thinkingTree.height = nodeElem.offsetHeight;
      if (thinkingTree.children.length > 0) {
        thinkingTree.children.forEach((child) => {
          updateHeight(child)
        })
      }
    }

    onActivated(() => {
      if (activedStep.value.indexOf('thinking') > 0 && graph != null) {
        graph.layout()
      }
    })

    onMounted(() => {
      console.log('thinking mount')
      defaultConfig['width'] = '100%';
      defaultConfig['height'] = '100%';
      registerFn();
      window['questionClosely'] = questionClosely
      window['answerAgain'] = answerAgain
      getData().then(() => {
        if (props.status == 'finish') {
          disabled.value = true;
          const thinking = thinkingData.value.thinking
          conversationMap.value = new Map(Object.entries(thinking.conversationMap))
          summaryText.value = thinkingData.value.summary.summaryText
          activedStep.value = ['presets', 'thinking', 'summary']
        }
      })
    });

    onUnmounted(() => {
      graph.destroy()
    })


    return {
      presets,
      activedStep,
      currentStep,
      conversationMap,
      inputValue,
      pidValue,
      referNodeId,
      referConversation,
      summaryText,
      disabled,
      isRebuild,
      getData,
      submitPresets,
      sendMessage,
      submitThinking,
      questionClosely,
      answerAgain,
      cancelRefer,
      endThinking,
      summary,
      rebuildGraph
    }
  }
});
</script>

<!-- 由于g6节点样式，所以不能加scoped -->
<style lang="scss">
.thinking-box-card {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
  color: #303133;
  transition: 0.3;
  // display: flex;
  // flex-direction: column;

  &:hover {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  }
}

.thinking-tree-area {
  flex: 1;
  // padding: 5px;
}

.thinking-message-content_hidden {
  display: block;
  border-radius: 5px;
  border: 1px solid #d1dbe582;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  width: 350px;
}

.thinking-message {
  width: 380px;
  padding-right: 30px;

  &:hover {
    .actions-display {
      opacity: .5;
      right: 0px;
    }
  }
}

.thinking-message-content {
  display: block;
  border-radius: 0px 5px 5px 5px;
  // border: 1px solid #d1dbe582;
  border: 1px solid #CED4D9;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  width: 350px;

  .thinking-message-actions {
    font-size: 12px;
    position: absolute;
    top: 20px;
    right: 20px;
    transition: all .3s ease;
    opacity: 0;
    // pointer-events: none;
    display: flex;
    flex-direction: column;
  }

  .thinking-message-button {
    // opacity: .5;
    white-space: nowrap;
    &:hover {
      color: black;
      font-weight: bolder;
      cursor: pointer;
    }
  }
}



.thinking-message-question {
  background-color: #748ffc;
  padding: 5px;
  color: #fff;
  border-radius: 0px 4px 0px 0px;
}

.thinking-message-answer {
  background-color: #fff;
  padding: 5px;
  border-radius: 0px 0px 4px 4px;
  // max-height: 450px;
  // overflow-y: auto;
}

.thinking-send-area {
  align-items: flex-end;
  /* background-color: #f2f2f2; */
  border-top: 1px solid rgb(244, 247, 247);
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
}

.input-area {
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.input-box {
  flex: 1;
  margin-right: 10px;
}

.btn-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  button {
    width: 100%;
  }
}

.markdown-body {
  background-color: transparent;
  font-size: 14px;

  p {
    white-space: pre-wrap;
  }

  p:not(:last-child),
  pre {
    margin-bottom: 10px;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    margin-left: 20px;
  }

  ul {
    list-style-type: disc;
  }

  pre code,
  pre tt {
    line-height: 1.65;
  }

  .highlight pre,
  pre {
    background-color: #fff;
  }

  code.hljs {
    padding: 5px;
  }

  .code-block {
    &-wrapper {
      position: relative;
      border-radius: 5px;
    }

    &-header {
      position: absolute;
      top: 5px;
      right: 0;
      width: 100%;
      padding: 0 1rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: #b3b3b3;
      border-radius: 10px;

      &__copy {
        cursor: pointer;
        margin-left: 0.5rem;
        user-select: none;
        border-radius: 10px;
        padding: 0px 8px;
        text-align: center;

        &:hover {
          // color: #65a665;
          background-color: #c4c4c493;
        }
      }
    }

    &-body {
      border-radius: 5px;
      border: 1px solid #e4e7ed;
    }
  }

}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}

// .el-tabs__content {
//   display: flex !important;
// }

.el-tab-pane {
  height: 100%;
}
</style>