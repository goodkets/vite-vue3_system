<template>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <div class="logo">
            <img style="width: 30%;height: 30%;" src="@/assets/images/logo.png" alt="" />
        </div>
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" v-model:openKeys="openKeys"
            :items="filteredMenuItemList" @click="selectMenu">
        </a-menu>
    </a-layout-sider>
</template>

<script setup lang='ts'>
import { computed, ref, reactive, VueElement, h } from 'vue';
import {
    AppstoreOutlined,
    TeamOutlined,
    UserAddOutlined,
    PlusOutlined
} from '@ant-design/icons-vue';
import { homeStoreInfo } from '@/store/home/index';
import type { ItemType } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import {userStoreInfo} from '@/store/user/index';

const router = useRouter();
const userStore = userStoreInfo();
const homeStore = homeStoreInfo();
const selectedKeys = ref<string[]>(['projectMassage']);
const openKeys = ref<string[]>(['Project-Management']); // 默认展开的子菜单键值
const uGrade = computed(() => userStore.userInfo.uGrade);
const collapsed = computed(() => homeStore.collapsed);
const getItem = (
    label: VueElement | string,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
): ItemType => {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as ItemType;
}

const baseMenuItems = reactive([
    getItem('用户管理', 'User-Management', () => h(TeamOutlined), [
        getItem('用户列表', 'userMassage', () => h(UserAddOutlined)),
    ]),
    getItem('项目管理', 'Project-Management', () => h(AppstoreOutlined), [
        getItem('项目列表', 'projectMassage', () => h(PlusOutlined)),
    ]),
]);
console.log(baseMenuItems);

const filteredMenuItemList = computed<ItemType[]>(() => {
    if(uGrade.value === 1) {
        return baseMenuItems.filter((item:any) => item.key !== 'User-Management');
    }
    return baseMenuItems;
})
const selectMenu = (e: any) => {
    selectedKeys.value = [e.key];
    router.push({
        name: e.key
    });
}
</script>

<style lang="less" scoped>
.logo {
    margin-top: 20px;
    text-align: center;
}
</style>
