// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

  // 假设event中包含了doctorid, date和maxNum
  const doctorid = event.doctorid;
  const date = event.date; // 预期的日期格式可能是'YYYY-MM-DD'
  const maxNum = event.maxNum; // 传入的最大数量

  // 聚合操作，计算每个时间段在guahao表中的记录数，并且减去maxNum
  const timeCounts = pztimeList.map(time => {
    // 过滤guahaoListRes.data，确保doctorid和date匹配，并且time也匹配
    const filteredGuahao = guahaoListRes.data.filter(item =>
      item.doctorid === doctorid &&
      item.bookdate === date &&
      item.time === time
    );

    // 计算匹配的记录数，并减去maxNum
    const count = maxNum - filteredGuahao.length;

    // 确保count不会小于0
    const finalCount = count < 0 ? 0 : count;

    return {
      time,
      count: finalCount
    };
  });
}