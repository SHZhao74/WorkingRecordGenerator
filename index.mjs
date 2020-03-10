import Pug from "pug";
import htmlPDF from "html-pdf";
import fs from "fs";

import GenContent from "./genContent.js";
import Config from "./config/index.js";

const { time_start, time_end, interval } = Config;
let { topics, share } = Config;
// const time_step = 86400000 * interval;
//PDF options
const options = {
  // format: "A4",
  width: "20.99cm",
  height: "29.7cm",
  border: {
    top: "2.35cm",
    bottom: "2.35cm",
    left: "1.95cm",
    right: "1.95cm"
  }
};

function prepareData(records) {
  const __dirname = process.env.PWD;
  // console.log(__dirname);
  records.forEach(r => {
    //圖片轉PDF需要絕對路徑
    
    if (r.img)
      if(Array.isArray(r.img))
      r.img.forEach(
        (img, i) => {r.img[i] = `file://${__dirname}/config/img/${img}`}
      );
      else r.img = `file://${__dirname}/config/img/${r.img}`;
    // console.log(r.img);
  });
  return records;
}
/**get 檔案名稱的時間起訖 (轉民國年) */
function timeRangeString(start, end) {
  return `${start.year() - 1910}${start.format("MMDD")}-${end.year() -
    1910}${end.format("MMDD")}`;
}
/**get 每個period的時間起訖 */
function getPeriodTime(timestamp, index) {
  const time = timestamp.clone();
  const year = time.year(),
    month = time.month() + 1;
  if (index % 2) {
    return [`${year}年${month}月1日`, `${year}年${month}月15日`];
  } else {
    return [
      `${year}年${month}月16日`,
      `${year}年${month}月${time.endOf("Month").date()}日`
    ];
  }
}
topics.forEach(t => (t.records = prepareData(t.records)));
share = prepareData(share);
const timeString = timeRangeString(time_start, time_end);

(async function Main() {
  //each topic
  topics.forEach(async (topic, index) => {
    // const dir = topic.name
    //each people
    console.log(topic.name);
    for (let i = 0; i < topic.many; i++) {
      const datas = []; //所有頁面的資料
      const NO = topic.NO ? topic.NO[i] : undefined; //如果人員有編號

      //each period
      for (let i = 1,time = time_start.clone(); time <= time_end; i++) {
        const data = {
          topic: topic.name,
          time: getPeriodTime(time, i),
          content: GenContent.getContent(topic, share, time)
        };
        if (i % 2 === 0) time.add(1, 'M');
        datas.push(data);
        // console.log({ NO, topic: topic.records[2] });
      }
      // console.log({ NO, ...datas });
      try {
        const htmlFile = Pug.renderFile("template.pug", { datas });
        const res = await htmlPDF.create(htmlFile, options).toFile(
          //A1.巴拉巴拉主題/NO34_1080701-1081231.pdf
          `./pdfs/${topic.name}(${topic.many}人)/${
          NO ? `NO${NO}_` : ""
          }${timeString}.pdf`, (err, res) => {
            console.log(res.filename);
          }
        );

      } catch (err) {
        console.error(err);
      }
    }
  });
})();
