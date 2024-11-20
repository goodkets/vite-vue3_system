import {
    defineStore
} from 'pinia'
import { webLogin,getProjectList } from "@/api/user/index"
import { message } from 'ant-design-vue'
import { setItem, removeItem,getItem } from "@/utils/storeages"

interface responseData {
    state?: number;
    token?: string;
    message?: string;
    data?:object
}
interface userInfo {
    name?: string;
    email?: string;
    uGrade?: number;
}

export const userStoreInfo = defineStore('user', {
    state: () => {
        return {
            token: getItem("token") || '',
            userInfo: (getItem("userInfo") || {}) as userInfo,
            projectList: getItem("projectList") || []
        }
    },
    getters: {},
    actions: {
        //登录
        async login(values:string) {
            try {
                const res: responseData = await webLogin(values);
                if(res.state === 0) {
                    this.token = res.token || '';
                    setItem('token', res.token || '');
                    this.userInfo = res.data || {};
                    setItem('userInfo', JSON.stringify(res.data) || '');
                    if (res.state === 0) {
                        setTimeout(() => {
                            message.success('登录成功!');
                            this.getProjectList();
                        }, 1200);
                    } else {
                        message.error(res.message);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },

        loginOut() {
            this.token = '';
            removeItem('token');
            removeItem('projectList')
            removeItem('userDataList')
        },
        async getProjectList() {
            try {
                const res: responseData = await getProjectList(JSON.stringify({token:this.token}));
                if (res.state === 0) {
                    this.projectList = JSON.stringify(res.data);
                    setItem('projectList', JSON.stringify(res.data));
                } else {
                   message.error(res.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
})