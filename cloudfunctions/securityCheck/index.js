const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID;
    let {
        type, //检测类型 图片/文本
    } = event;
    try {
        var result = {};
        if (type == 0) { //文本检测
            result = await cloud.openapi.security.msgSecCheck({
                "openid": openid,
                "version": 2,
                ...event.params
            })
        } else if(type == 1){ //图片检测
            result = await cloud.openapi.security.mediaCheckAsync({
                "openid": openid, //用户openid
                "scene": 3, //场景：社交日志
                "version": 2, //版本
                "mediaType": 2, //类型：图片
                "mediaUrl": event.params.imageUrl
            })
        }else{
            result = {
                errCode:404,
                msg:"类型未找到！"
            }
        }
        return result
    } catch (err) {
        return err
    }
}