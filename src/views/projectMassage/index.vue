<template>
    <div class="addUser">
        <div  v-if="!adminStatus">
            <EditeUser v-model:editeStatus="editeStatus" v-model:editeData="editeData" @PostgetUserListData="PostgetUserListData" />
        </div>
        <div class="admin" v-else>
            <AddProject @PostgetUserListData="PostgetUserListData" />
            <EditeProject v-model:editeStatus="editeStatus" :editeData="editeData"
                @PostgetUserListData="PostgetUserListData" />
        </div>

    </div>

    <div class="table">
        <a-table bordered :columns="columns" class="components-table-demo-nested" :scroll="{ y: 550 }" :data-source="tableList"
            :loading="loading" >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'operation'">
                    <div class="setting">
                        <div>
                            <a-button type="primary" class="btn" @click="() => handleEdit(record)">编辑</a-button>
                        </div>
                        <div class="danger">
                            <a-popconfirm title="你确定要删除该用户·吗？" ok-text="Yes" cancel-text="No"
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
            <template #expandedRowRender="{ column, record }" v-if="adminStatus">
                <ProjectexpandTable :projectId="record.id" />
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
import { getUserProjectData, ProjectDeleteData } from '@/api/project/index'
import { userStoreInfo } from '@/store/user/index'
import { message, type TableColumnsType } from 'ant-design-vue';
import AddProject from "@/components/project/addProject.vue"
import EditeProject from '@/components/project/editeProject.vue'
import ProjectexpandTable from '@/components/project/projectexpandTable.vue'
import EditeUser from '@/components/project/editeUser.vue'
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
const adminStatus = ref(false)
const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0
})
const editeStatus = ref(false)
const editeData = ref({})

const columns = ref<TableColumnsType>([
    {
        title: 'id', dataIndex: 'id', key: 'id', fixed: 'left', align: "center"
    },
    { title: '项目名称', dataIndex: 'projectName', key: 'projectName', fixed: 'left', align: "center" },
    { title: '项目描述', dataIndex: 'describe', key: 'describe', align: "center" },
    { title: '操作', dataIndex: 'operation', key: 'operation', align: "center" },
])

//普通管理员只能看到自己的项目
const systemColumns: TableColumnsType = [
    { title: 'id', dataIndex: 'id', key: 'id', fixed: 'left', align: "center" },
    { title: '用户', dataIndex: 'name', key: 'name', fixed: 'left', align: "center" },
    { title: '所属账号', dataIndex: 'account', key: 'account', align: "center" },
    { title: 'uuid', dataIndex: 'uuid', key: 'uuid', align: "center" },
    { title: '操作', dataIndex: 'operation', key: 'operation', align: "left" },
];

let tableList: DataItem[] = reactive([]);

const getUserListData = async () => {
    try {
        loading.value = true
        const token = userStore.token
        const pageSize = pagination.value.pageSize
        const page = pagination.value.current
        const type = 'project'
        const res:IRes = await getUserProjectData(JSON.stringify({ token, pageSize, page, type }))
        //console.log(res)
        if (res.state == 0) {
            if(!res.data.data[0].uuid) {
                adminStatus.value = true
                
            } else {
                columns.value = systemColumns//显示普通管理员数据列表
            }
            pagination.value.total = res.data.count
            const list = res.data.data
            for (let i = 0; i < list.length; i++) {
                list[i].key = list[i].id
                for (let y in res.data.data[i]) {
                    if (list[i][y] === '' || list[i][y] == null) {
                        list[i][y] = '暂无'
                    }
                }
            }
            setTimeout(() => {
                tableList = [...list]
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
        const type = 'project'
        const res:IRes = await ProjectDeleteData(JSON.stringify({ token, id, type }))
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
    justify-content: center;

    .danger {
        margin-left: 30px;
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

.text-container {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    span {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 10px;
    }
}
</style>