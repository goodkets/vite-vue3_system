import request from "../request";

/**
 *  web登录
 * @param data 
 */
export const webLogin = (data: string) => {
  return request({
    url: "/webLogin",
    method: "post",
    data,
  });
};

/**
 *  获取用户列表
 * @param data 
 */
export const getUserDataList = (data:string) => {
  return request({
    url:'/getUserData',
    method:'post',
    data
  })
}

/**
 *  新增用户
 * @param data
 */
export const addUser = (data:string) => {
  return request({
    url:'/webAddUser',
    method:'post',
    data
  })
}

/**
 *  删除用户
 * @param data
 */ 
export const webDeleteUser = (data:string) => {
  return request({
    url:'/webDeleteUser',
    method:'post',
    data
  })
}

/**
 *  修改用户
 * @param data
 */

export const ModificationUserAndData = (data:string) => {
  return request({
    url:'/ModificationUserAndData',
    method:'post',
    data
  })
}

/**
 *  获取当前用户项目
 * @param data
 */
export const getProjectList = (data:string) => {
  return request({
    url:'/getProjectList',
    method:'post',
    data
  })
}