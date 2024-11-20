<template>
    <a-modal v-model:open="open" title="编辑用户" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
            <a-form-item label="用户账户" name="account" required>
                <a-input v-model:value="formState.account" ref="accountInput" />
            </a-form-item>
            <a-form-item label="用户密码" name="password" required>
                <a-input v-model:value="formState.password" />
            </a-form-item>
            <a-form-item label="用户等级" name="uGrade" required>
                <a-select v-model:value="formState.uGrade" placeholder="请选择用户等级">
                    <a-select-option value="超级管理员">超级管理员</a-select-option>
                    <a-select-option value="普通管理员">普通管理员</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="项目名称">
                <a-select v-model:value="formState.projectName" placeholder="请选择项目">
                    <a-select-option v-for="(item, index) in projectList" :key="index" :value="item">{{ item
                        }}</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, computed } from 'vue';
import { FormInstance } from 'ant-design-vue';
import { userStoreInfo } from '@/store/user';
import { message } from 'ant-design-vue';
import { ModificationUserAndData } from '@/api/user/index';
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
const projectList = ref([]);
watch(() => userStore.projectList, (newVal:any) => {
    projectList.value = JSON.parse(newVal) || [];
});

let formState: FormState = reactive({
    ...props.editeData
});

const rules = {
    account: [
        { required: true, message: '请输入用户名!', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码!', trigger: 'blur' },
    ],
    uGrade: [
        { required: true, message: '请选择用户等级!', trigger: 'change' },
    ],
};

const formRef = ref<FormInstance>();
const accountInput = ref<HTMLInputElement | null>(null); // 新增的引用

watch(() => props.editeStatus, (newVal) => {
    if (newVal) {
        open.value = true;
        formState = reactive({
            ...props.editeData,
            uGrade: props.editeData.uGrade === 0 ? '超级管理员' : '普通管理员',
            projectName: props.editeData.projectName === '暂无' ? '' : props.editeData.projectName,
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
            console.log(formState);
            const ModifyData = {
                account: formState.account,
                password: formState.password,
                uGrade: formState.uGrade == '超级管理员' ? 0 : 1,
                projectName: formState.projectName
            }
            const res:IRes = await ModificationUserAndData(JSON.stringify({ id, token, ModifyData }));
            if (res.state === 0) {
                message.success('修改成功!');
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