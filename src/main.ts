import { createApp } from 'vue'
import { Button, Form, Input, Checkbox,Layout,Menu,Dropdown, Pagination,Table,Tag,Modal,Select, Space, Popconfirm, Tooltip } from 'ant-design-vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import './style.css'

const app = createApp(App)
app.use(router)
app.use(Button)
app.use(Form)
app.use(Input)
app.use(Checkbox)
app.use(Layout)
app.use(Menu)
app.use(Dropdown)
app.use(Pagination)
app.use(Table)
app.use(Tag)
app.use(Modal)
app.use(Select)
app.use(Space)
app.use(Popconfirm)
app.use(Tooltip)

app.use(store)
app.use(Antd)
app.mount('#app')