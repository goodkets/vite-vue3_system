<template>
    <div class="add-user">
        <a-button type="primary" @click="showModal">
            <template #icon>
                <UserAddOutlined />
            </template>
            添加用户
        </a-button>
        <a-modal v-model:open="open" title="新增用户" :confirm-loading="confirmLoading" @ok="handleOk">
            <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
                <a-form-item label="用户昵称" name="name" required>
                    <a-input v-model:value="formState.name" ref="accountInput" />
                </a-form-item>
                <a-form-item label="用户账号" name="account" required>
                    <a-input v-model:value="formState.account" />
                </a-form-item>
                <a-form-item label="用户密码" name="password" required>
                    <a-input v-model:value="formState.password" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from 'vue';
import type { UnwrapRef } from 'vue';
import { UserAddOutlined } from '@ant-design/icons-vue';
import { FormInstance, message } from 'ant-design-vue';
import { ProjectAddUser } from '@/api/project';
import { userStoreInfo } from '@/store/user';
import { AxiosResponse } from 'axios';

interface FormState {
    account: string;
    password: string;
    name: string;
}

interface IRes extends AxiosResponse {
  state?: number;
}

const userStore = userStoreInfo();

const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const labelCol = { style: { display: 'flex', justifyContent: 'center' } };
const wrapperCol = {};
const emit = defineEmits(['PostgetUserListData']);
const props = defineProps({
    projectId: {
        type: Number,
        default: 0
    }
})



let formState: UnwrapRef<FormState> = reactive({
    account: '',
    password: '',
    name: '',
});

const rules = {
    account: [
        { required: true, message: '请输入用户名!', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码!', trigger: 'blur' },
    ],
    name : [
        { required: true, message: '请输入用户昵称!', trigger: 'blur' },
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
            const addData = {
                account: formState.account,
                password: formState.password,
                name: formState.name,
                pid: props.projectId,
                uuid: ''
            }
            const token = userStore.token;
            const res:IRes = await ProjectAddUser(JSON.stringify({ addData, token }));
            if (res.state === 0) {
                message.success('添加成功');
                emit('PostgetUserListData', true);
                formState = {
                    account: '',
                    password: '',
                    name:''
                };
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