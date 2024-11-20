<template>
    <div class="addUser">
        <AddUser @PostgetUserListData="PostgetUserListData" />
        <AditeUser v-model:editeStatus="editeStatus" :editeData="editeData"
            @PostgetUserListData="PostgetUserListData" />
    </div>

    <div class="table">
        <a-table :columns="columns" :scroll="{ y: 550 }" :data-source="tableList" :pagination="false"
            :loading="loading">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'operation'">
                    <div class="setting">
                        <div>
                            <a-button type="primary" class="btn" @click="() => handleEdit(record)">编辑</a-button>
                        </div>
                        <div class="danger">
                            <a-popconfirm title="你确定要删除该用户吗？" ok-text="Yes" cancel-text="No"
                                @confirm="handleDelete(record)">
                                <a-button type="primary" danger class="btn">删除</a-button>
                            </a-popconfirm>

                        </div>
                    </div>
                </template>
                <template v-if="column.key === 'uGrade'">
                    <a-tag :key="column.key" :color="record.tag" bordered>
                        {{ record.uGrade !== '暂无' ? record.uGrade : '' }}
                    </a-tag>
                </template>
            </template>
        </a-table>
        <div class="pagination">
            <a-pagination v-model:current="pagination.current" :total="pagination.total"
                :show-total="(total: number, range: any[]) => `${range[0]}-${range[1]} of ${total} items`"
                :defaultPageSize="pagination.pageSize" @change="paginatonFunc" @showSizeChange="paginatonPageSize" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref, onMounted } from 'vue'
import { getUserDataList, webDeleteUser } from '@/api/user/index'
import { userStoreInfo } from '@/store/user/index'
import { message, type TableColumnsType } from 'ant-design-vue';
import AddUser from "@/components/user/addUser.vue"
import AditeUser from '@/components/user/editeUser.vue'
import { AxiosResponse } from 'axios';

interface IRes extends AxiosResponse {
  state?: number;
}


interface DataItem {
    key: number;
    name: string;
    age: number;
    address: string;
}

const userStore = userStoreInfo()
const loading = ref(false)
const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0
})
const editeStatus = ref(false)
const editeData = ref({})

const columns: TableColumnsType = [
    { title: 'id', dataIndex: 'id', key: 'id', fixed: 'left', align: "center" },
    { title: '账号', dataIndex: 'account', key: 'account', fixed: 'left', align: "center" },
    { title: '所属项目', dataIndex: 'projectName', key: 'projectName', align: "center" },
    { title: '账户等级', align: "center", dataIndex: 'uGrade', key: 'uGrade' },
    { title: '操作', dataIndex: 'operation', key: 'operation', align: "left" },
];

let tableList: DataItem[] = reactive([]);

const getUserListData = async () => {
    try {
        loading.value = true
        const res:IRes = await getUserDataList(JSON.stringify(
            { token: userStore.token, pageSize: pagination.value.pageSize, page: pagination.value.current }))
        if (res.state == 0) {
            pagination.value.total = res.data.count
            for (let i = 0; i < res.data.data.length; i++) {
                for (let y in res.data.data[i]) {
                    if (res.data.data[i][y] === '' || res.data.data[i][y] == null) {
                        res.data.data[i][y] = '暂无'
                    }
                }
                if (res.data.data[i].uGrade == '0') {
                    res.data.data[i].tag = '#f50'
                } else if (res.data.data[i].uGrade == '1') {
                    res.data.data[i].tag = 'orange'
                }
            }
            setTimeout(() => {
                tableList = [...res.data.data]
                loading.value = false
            }, 1500)
        }
    } catch (error) {
        loading.value = false
        console.log(error)
    }
}

const paginatonFunc = (page: number, pageSize: any) => {
    pagination.value.current = page
    getUserListData()
}

const paginatonPageSize = (current: any, size: number) => {
    pagination.value.pageSize = size
    getUserListData()
}

const PostgetUserListData = () => {
    getUserListData()
}

const handleEdit = (e: {}) => {
    // console.log(e)
    editeStatus.value = true
    editeData.value = e
}
const handleDelete = async (e: { id: string }) => {
    try {
        const token = userStore.token
        const id = e.id
        const res:IRes = await webDeleteUser(JSON.stringify({ token, id }))
        if (res.state == 0) {
            message.success('删除成功!')
            getUserListData()
        }
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    getUserListData()
})
</script>

<style lang="less" scoped>
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.setting {
    display: flex;

    .danger {
        margin-left: 10px;
    }
}

.ant-table .ant-table-body {
    /* 设置滚动条容器的样式 */
    overflow-y: auto !important;
    /* 只有垂直滚动条 */
    max-height: 100% !important;
    /* 可以根据需要调整 */

    /* 定制滚动条轨道 */
    &::-webkit-scrollbar {
        width: 8px;
        /* 设置滚动条的宽度 */
    }

    /* 定制滚动条的滑块部分 */
    &::-webkit-scrollbar-thumb {
        width: 10px;
        /* 设置滑块的宽度 */
        background-color: #ccc;
        border-radius: 10px;
    }

    /* Firefox 滚动条样式 */
    &::-moz-scrollbar {
        width: 8px;
    }

    &::-moz-scrollbar-thumb {
        width: 10px;
        background-color: #ccc;
        border-radius: 10px;
    }
}
</style>