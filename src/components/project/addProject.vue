<template>
    <div class="add-user">
        <a-button type="primary" @click="showModal">
            <template #icon>
                <PlusOutlined />
            </template>
            新增项目
        </a-button>
        <a-modal v-model:open="open" title="新增项目" :confirm-loading="confirmLoading" @ok="handleOk">
            <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                <a-form-item label="项目名称" name="projectName" required>
                    <a-input v-model:value="formState.projectName" ref="accountInput" />
                </a-form-item>
                <a-form-item label="项目描述" name="describe">
                    <a-textarea :rows="4"  placeholder="描述不能超过100字" :maxlength="100"   v-model:value="formState.describe" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { UnwrapRef } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { FormInstance, message } from 'ant-design-vue';
import { addProject } from '@/api/project';
import { userStoreInfo } from '@/store/user';
import { AxiosResponse } from 'axios';

interface IRes extends AxiosResponse {
  state?: number;
}

interface FormState {
    projectName: string;
    describe: string;
}



const userStore = userStoreInfo();

const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const labelCol = { style: { display: 'flex', justifyContent: 'center' } };
const wrapperCol = {};
const emit = defineEmits(['PostgetUserListData']);



let formState: UnwrapRef<FormState> = reactive({
    projectName: '',
    describe: ''
});

const rules = {
    projectName: [
        { required: true, message: '请输入项目名称', trigger: 'blur' }
    ]
};

const formRef = ref<FormInstance>();
const accountInput = ref<HTMLInputElement | null>(null); // 新增的引用

const showModal = () => {
    open.value = true;
};

const handleOk = () => {
    const promise = formRef.value?.validate();
    promise?.then(async () => {
        confirmLoading.value = true;
        setTimeout(async () => {
            open.value = false;
            confirmLoading.value = false;
            const token = userStore.token;
            const data = { token, ...formState }
            const res:IRes = await addProject(JSON.stringify(data));
            if (res.state === 0) {
                message.success('添加成功');
                userStore.getProjectList();
                emit('PostgetUserListData', true);
                formState = reactive({
                    projectName: '',
                    describe: ''
                });
            }
        }, 2000);
    }).catch((e) => {
        message.error('请填写完整信息');
    });
};
</script>

<style scoped lang="less">
.add-user {
    margin: 20px 10px;
}
</style>
