<template>
    <a-modal v-model:open="open" title="编辑项目" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
            <a-form-item label="项目名称" name="projectName" required>
                    <a-input v-model:value="formState.projectName" ref="accountInput" />
                </a-form-item>
                <a-form-item label="项目描述" name="describe">
                    <a-textarea :rows="4"  placeholder="描述不能超过100字" :maxlength="100"   v-model:value="formState.describe" />
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

interface FormState {
    id?: number,
    projectName?: string,
    describe?: string
}
interface IRes extends AxiosResponse {
  state?: number;
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
const open = ref<boolean>(props.editeStatus)
const emit = defineEmits(['update:editeStatus', 'PostgetUserListData']);
const confirmLoading = ref<boolean>(false);
const labelCol = { style: { display: 'flex', justifyContent: 'center' } };
const wrapperCol = {};

let formState: FormState = reactive({
    ...props.editeData
});

const rules = {
    projectName: [
        { required: true, message: '请输入项目名称', trigger: 'blur' }
    ]
};

const formRef = ref<FormInstance>();
const accountInput = ref<HTMLInputElement | null>(null); // 新增的引用

const handleCancel = () => {
    open.value = false
    emit('update:editeStatus', false);
}

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
            const type = 'project'
            const modifyData = {
                projectName: formState.projectName,
                describe: formState.describe
            }
            const res:IRes = await ProjectModifiesData(JSON.stringify({ id, token, modifyData,type }));
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