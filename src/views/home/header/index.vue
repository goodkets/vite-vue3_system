<template>
    <a-layout-header style="background: #fff; padding: 0">
        <div class="header">
            <div class="changeStatus">
                <menu-unfold-outlined v-if="collapsed" class="trigger" @click="toggle()" />
                <menu-fold-outlined v-else class="trigger" @click="toggle()" />
            </div>
            <div class="user">
                <div className="avatar">
                    <a-dropdown placement="bottomRight" :arrow="{ pointAtCenter: true }">
                        <template #overlay>
                            <a-menu @click="handleMenuClick">
                                <a-menu-item key="1">
                                    <div class="loginOut">
                                        <LoginOutlined />
                                        退出系统
                                    </div>
                                </a-menu-item>
                            </a-menu>
                        </template>
                        <a class="dropdown-img">
                            <!-- <Space> -->
                                <img src="@/assets/images/avatar.jpeg" alt="" />
                            <!-- </Space> -->
                        </a>
                    </a-dropdown>
                </div>
            </div>
        </div>

    </a-layout-header>
</template>

<script setup lang='ts'>
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LoginOutlined
} from '@ant-design/icons-vue';
import { ref } from 'vue';
import { homeStoreInfo } from '@/store/home/index';
import { userStoreInfo } from '@/store/user/index';
import { useRouter } from 'vue-router';

const homeStore = homeStoreInfo();
const userStore = userStoreInfo();
const router = useRouter();

const collapsed = ref<boolean>(homeStore.collapsed);
const toggle = () => {
    collapsed.value = homeStore.changeCollapsed()
};
const handleMenuClick = (e: any) => {
    if (e.key === '1') {
        userStore.loginOut()
        router.push('/login')
    }
};

</script>

<style lang="less" scoped>
.header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;

    .changeStatus {
        font-size: 18px;
        cursor: pointer;
        transition: color 0.3s;
    }

    .loginOut {
        color: red;
        padding: 10px;
    }

    .dropdown-img {

        img {
            width: 45px;
            height: 45px;
            border-radius: 100%;
        }
    }
}
</style>
