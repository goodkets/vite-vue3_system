<template>
    <a-layout>
        <div class="login-wrapper">
            <div class="login-content">
                <div class="login-content-title">
                    <img src="@/assets/images/logo.png" alt="" />
                    <h3>账号登录</h3>
                </div>
                <a-form :model="formState" :rules="rules" @finish="onFinish">
                    <a-form-item name="account">
                        <a-input v-model:value="formState.account" placeholder="Username" allow-clear>
                            <template #prefix>
                                <user-outlined style="color: rgba(0, 0, 0, 0.25)" />
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="password">
                        <a-input-password v-model:value="formState.password" placeholder="Password" allow-clear>
                            <template #prefix>
                                <lock-outlined style="color: rgba(0, 0, 0, 0.25)" />
                            </template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" html-type="submit" :loading="loading" class="login-content-btn">
                            Log in
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { userStoreInfo } from '@/store/user/index';
import { useRouter } from 'vue-router';

const router = useRouter();
const storeInfo = userStoreInfo();

interface FormState {
    account: string;
    password: string;
}

const formState = ref<FormState>({
    account: '',
    password: '',
});

const rules = {
    account: [
        { required: true, message: 'Please input your username!', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Please input your password!', trigger: 'blur' },
    ],
};

const loading = ref(false);

const onFinish = async (values: FormState) => {
    try {
        loading.value = true;
        await storeInfo.login(JSON.stringify(values));
        loading.value = false;
        router.push('/');
    } catch (error) {
        message.error('登录失败!');
        console.log(error);
    }
};
</script>

<style lang="less" scoped>
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-image: url('@/assets/images/login-background.jpg');

    .login-content {
        padding: 16px 30px 10px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 15px 30px 0 rgba(0, 0, 1, .1);

        &-title {
            margin: 0 auto 35px;
            text-align: center;
            color: #707070;
            font-size: 18px;
            letter-spacing: 2px;

            img {
                width: 82px;
                height: 82px;
                margin: 12px auto 0;
            }
        }

        &-form {
            width: 320px;
        }

        &-control {
            display: flex;
            justify-content: space-between;
            color: red;
        }

        &-btn {
            width: 100%;
        }

        .no-margin {
            margin-bottom: 0;
            color: #000;
        }
    }
}
</style>