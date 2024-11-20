<template>
    <a-modal v-model:open="open" title="编辑用户" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
            <a-form-item label="用户账户" name="account" required>
                <a-input v-model:value="formState.account" ref="accountInput" />
            </a-form-item>
            <a-form-item label="用户昵称" name="name" required>
                <a-input v-model:value="formState.name" ref="accountInput" />
            </a-form-item>
            <a-form-item label="用户密码" name="password" required>
                <a-input v-model:value="formState.password" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, computed } from 'vue';
import { FormInstance } from 'ant-design-vue';
import { userStoreInfo } from '@/store/user';
import { message } from 'ant-design-vue';
import { ProjectModifiesData } from '@/api/project/index';
import { AxiosResponse } from 'axios';

interface IRes extends AxiosResponse {
  state?: number;
}


interface FormState {
    id?: string;
    account?: string;
    password?: string;
    projectName?: string;
    uGrade?: string;
    name?: string;
}

const userStore = userStoreInfo();
const props = defineProps({
    editeStatus: {
        type: Boolean,
        default: false
    },
    editeData: {
        type: Object,
        default: () => ({} as FormState)
    }
});
const emit = defineEmits(['update:editeStatus', 'PostgetUserListData']);
const open = ref<boolean>(props.editeStatus);
const confirmLoading = ref<boolean>(false);
const labelCol = { style: { display: 'flex', justifyContent: 'center' } };
const wrapperCol = {};

let formState: FormState = reactive({
    ...props.editeData
});
console.log(props.editeData);

const rules = {
    account: [
        { required: true, message: '请输入用户名!', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码!', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入用户昵称!', trigger: 'blur' },
    ],
};

const formRef = ref<FormInstance>();
const accountInput = ref<HTMLInputElement | null>(null); // 新增的引用

watch(() => props.editeStatus, (newVal) => {
    if (newVal) {
        open.value = true;
        formState = reactive({
            ...props.editeData
        });
    } else {
        open.value = false;
    }
}, { immediate: true })

const handleCancel = () => {
    open.value = false
    emit('update:editeStatus', false);
}

const handleOk = () => {
    const promise = formRef.value?.validate();
    promise?.then(() => {
        confirmLoading.value = true;
        setTimeout(async () => {
            open.value = false;
            confirmLoading.value = false;
            emit('update:editeStatus', false);
            emit('PostgetUserListData', true);
            const id = formState.id;
            const token = userStore.token;
            const type = 'users';
            const modifyData = {
                account: formState.account,
                password: formState.password,
                name: formState.name
            }
            const res:IRes = await ProjectModifiesData(JSON.stringify({ id, token, modifyData, type }));
            if (res.state === 0) {
                message.success('修改成功!');
                emit('PostgetUserListData', true);
            } else {
                message.error('修改失败！');
            }
        }, 2000);
    }).catch((e) => {
        message.error('请填写完整信息');
    });
};
</script>

<style lang="less" scoped></style>