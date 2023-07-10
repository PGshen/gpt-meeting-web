/*
 * @Descripttion: 按需引入elementUI组件
 * @version: 
 * @Date: 2023-04-09 22:33:53
 * @LastEditTime: 2023-07-02 16:30:14
 */
import {
  ElAlert,
  ElAside,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElTabs,
  ElTabPane,
  ElCheckbox,
  ElIcon,
  ElDivider,
  ElContainer,
  ElMenu,
  ElMenuItem,
  ElHeader,
  ElFooter,
  ElMain,
  ElCard,
  ElText,
  ElSwitch,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElAvatar,
  ElDialog,
  ElOption,
  ElMessage,
  ElUpload,
  ElDrawer,
  ElTooltip,
  ElPopper,
  ElProgress,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElNotification,
  ElDescriptions,
  ElDescriptionsItem,
  ElCollapse,
  ElCollapseItem,
  ElStep,
  ElSteps,
  ElEmpty,
  ElScrollbar,
  ElAffix,
  ElTag,
  ElSlider
} from 'element-plus';


// 所需的组件
export const components = [
  ElAlert,
  ElAside,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElTabs,
  ElTabPane,
  ElCheckbox,
  ElIcon,
  ElDivider,
  ElContainer,
  ElMenu,
  ElMenuItem,
  ElHeader,
  ElFooter,
  ElMain,
  ElCard,
  ElText,
  ElSwitch,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElAvatar,
  ElDialog,
  ElOption,
  ElMessage,
  ElUpload,
  ElDrawer,
  ElTooltip,
  ElPopper,
  ElProgress,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElNotification,
  ElDescriptions,
  ElDescriptionsItem,
  ElCollapse,
  ElCollapseItem,
  ElStep,
  ElSteps,
  ElEmpty,
  ElScrollbar,
  ElAffix,
  ElTag,
  ElSlider
];

import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// 注册
export default (app: any) => {
  components.forEach((component) => {
    app.component(component.name, component);
  });
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
};
