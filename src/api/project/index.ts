import request from "../request";

/**
 *  获取项目管理列表
 * @param data 
 */

export const getUserProjectData = (data: string) => {
  return request({
    url: "/getUserProjectData",
    method: "post",
    data,
  });
}

/**
 * 新增项目
 * @param data
 */

export const addProject = (data: string) => {
  return request({
    url: "/addProject",
    method: "post",
    data,
  });
}

/**
 * 编辑项目
 * @param data
 */

export const ProjectModifiesData = (data: string) => {
  return request({
    url: "/ProjectModifiesData",
    method: "post",
    data,
  });
}

/**
 * 新增项目中的用户
 * @param data
  */

export const ProjectAddUser = (data: string) => {
  return request({
    url: "/ProjectAddUser",
    method: "post",
    data,
  });
}

/**
 * 删除项目/用户
 * @param data
 * */
export const ProjectDeleteData = (data: string) => {
  return request({
    url: "/ProjectDeleteData",
    method: "post",
    data,
  });
}



