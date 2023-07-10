<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-12 18:24:40
 * @LastEditTime: 2023-07-09 15:09:41
-->
<template>
  <div style="width: 100%; padding: 30px;">
    <h3>设置</h3>
    <el-alert title="API Key透传，仅保存至本地" />
    <div class="basic">
      <el-form
        :model="setting"
        label-width="120px"
      >
        <el-form-item
          label="API Key"
          :required="true"
        >
          <el-input
            v-model="setting.apiKey"
            show-password
          />
        </el-form-item>
        <el-form-item label="模型Model">
          <el-select
            v-model="setting.model"
            placeholder="please select model"
          >
            <el-option
              label="gpt-3.5-turbo"
              value="gpt-3.5-turbo"
            />
            <el-option
              label="gpt-3.5-turbo-0613"
              value="gpt-3.5-turbo-0613"
            />
            <el-option
              label="gpt-3.5-turbo-16k-0613"
              value="gpt-3.5-turbo-16k-0613"
            />
            <el-option
              label="gpt-4"
              value="gpt-4"
            />
            <el-option
              label="gpt-4-0613"
              value="gpt-4-0613"
            />
            <el-option
              label="gpt-4-32k-0613"
              value="gpt-4-32k-0613"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="随机性">
          <el-slider
            v-model="setting.temperature"
            show-input
            :min="0"
            :max="1"
            :step="0.1"
          />
        </el-form-item>
        <el-form-item label="新鲜度">
          <el-slider
            v-model="setting.presencePenalty"
            show-input
            :min="-2"
            :max="2"
            :step="0.1"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            color="#748ffc"
            plain
            @click="updateSetting()"
          >
            更新
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { Setting } from '@/types/setting';
import { useSettingStore } from '@/store/setting'
import { ElMessage } from 'element-plus';

export default defineComponent({
    name: 'SettingComp',
    setup() {
      const setting = ref({} as Setting);

      const settingStore = useSettingStore();

      const updateSetting = () => {
        settingStore.updateSetting(setting.value);
        ElMessage.success('update success ~')
      }

      onMounted(() => {
        setting.value = settingStore.getSetting()
      })

      return {
        setting,
        updateSetting
      }
    }
});
</script>

<style lang="scss" scoped>
.basic {
    width: 100%;
    min-height: 50px;
    border-bottom: 1px solid rgb(230, 230, 230);
    padding: 10px 0px;
    margin-bottom: 20px;
}

.account-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    margin-bottom: 5px;
}
</style>
<style>
.el-slider__bar {
  background-color: #748ffc;
}
</style>
  