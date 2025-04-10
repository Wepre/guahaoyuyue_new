// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const doctorid = event.doctorid;
  const date = event.date;
  const maxNum = event.maxNum; // 传入的最大数量
  try {
    // 聚合查询
    const pztimeRes = await db.collection('pztimeList').get()
    const guahaoListRes = await db.collection('guahao').get()

    // 聚合操作，计算每个时间段在guahao表中的记录数
    const timeCounts = pztimeRes.data.map(pztimeItem => {
      const filteredGuahao = guahaoListRes.data.filter(guahaoItem =>
        guahaoItem.ghdoctor == doctorid &&
        guahaoItem.bookdate == date &&
        guahaoItem.time == pztimeItem.time
      );

      // 计算匹配的记录数，并减去maxNum
      const count = maxNum - filteredGuahao.length;

      // 确保count不会小于0
      const finalCount = count < 0 ? 0 : count;

      // 返回对象，包含time, zone和count
      return {
        time: pztimeItem.time,
        zone: pztimeItem.zone,
        count: finalCount
      };
    });
    return timeCounts
  } catch (err) {
    console.error(err)
    return err
  }
}
