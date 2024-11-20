<template>
    <div class="expandTable">
        <AddUser :projectId="projectId" @PostgetUserListData="PostgetUserListData" />
        <EditeUser v-model:editeStatus="editeStatus" v-model:editeData="editeData" @PostgetUserListData="PostgetUserListData" />
        <a-table bordered :columns="usersColumns" :scroll="{ y: 550 }" :data-source="tableList" :pagination="false"
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
                <template v-if="column.key === 'describe'">
                    <a-tooltip>
                        <div class="text-container">
                            <span>{{ record.describe }}</span>
                        </div>
                        <template #title>
                            <div class="tips">
                                {{ record.describe }}
                            </div>
                        </template>
                    </a-tooltip>
                </template>
            </template>
        </a-table>
        <div class="pagination">
            <a-pagination v-model:current="pagination.current" :total="pagination.total"
            hideOnSinglePage
                :show-total="(total: number, range: any[]) => `${range[0]}-${range[1]} of ${total} items`"
                :defaultPageSize="pagination.pageSize" @change="paginatonFunc" @showSizeChange="paginatonPageSize" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { getUserProjectData, ProjectDeleteData } from '@/api/project/index'
import { userStoreInfo } from '@/store/user/index'
import { message, type TableColumnsType } from 'ant-design-vue';
import EditeUser from '@/components/project/editeUser.vue'
import AddUser from "@/components/project/addUser.vue"
import { AxiosResponse } from 'axios';

interface IRes extends AxiosResponse {
  state?: number;
}


interface DataItem {
    key: number;
    name: string;
    age: number;
    address: string;
    children?: DataItem[];
}

const props = defineProps({
    projectId: {
        type: Number,
        default: 0
    }
})

const pagination = ref({
    current: 1,
    pageSize: 5,
    total: 0
})

const userStore = userStoreInfo()
const editeStatus = ref(false)
const editeData = ref({})

const loading = ref(false);
const tableList = ref<DataItem[]>([]);
const usersColumns: TableColumnsType = [
    { title: 'id', dataIndex: 'id', key: 'id', fixed: 'left', align: "center" },
    { title: '账户', dataIndex: 'account', key: 'account', align: "center" },
    { title: '用户昵称', dataIndex: 'name', key: 'name', fixed: 'left', align: "center" },
    { title: 'uuid', dataIndex: 'uuid', key: 'uuid', align: "center" },
    { title: '操作', dataIndex: 'operation', key: 'operation', align: "left" },
];

const getUserListData = async () => {
    try {
        loading.value = true
        const token = userStore.token
        const pageSize = pagination.value.pageSize
        const page =  pagination.value.current
        const type = 'users'
        const id = props.projectId
        const res:IRes = await getUserProjectData(JSON.stringify({ token, pageSize, page, type, id }))
          if (res.state == 0) {
            pagination.value.total = res.data.count
            for (let i = 0; i < res.data.data.length; i++) {
                for (let y in res.data.data[i]) {
                    if (res.data.data[i][y] === '' || res.data.data[i][y] == null) {
                        res.data.data[i][y] = '暂无'
                    }
                }
            }
            setTimeout(() => {
                tableList.value = [...res.data.data]
                loading.value = false
            }, 1000)
        }
    } catch (error) {
        loading.value = false
        console.log(error)
    }
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
        const type = 'users'
        const res:IRes = await ProjectDeleteData(JSON.stringify({ token, id, type }))
        if (res.state == 0) {
            message.success('删除成功!')
            getUserListData()
        }
    } catch (error) {
        console.log(error)
    }
}

const PostgetUserListData = () => {
    getUserListData()
}

const paginatonFunc = (page: number, pageSize: any) => {
    pagination.value.current = page
    getUserListData()
}

const paginatonPageSize = (current: any, size: number) => {
    pagination.value.pageSize = size
    getUserListData()
}


onMounted(() => {
    getUserListData()
})
</script>

<style lang="less" scoped>
.setting {
    display: flex;
    justify-content: center;

    .danger {
        margin-left: 30px;
    }
}
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
</style>
