import Moment from "moment";
import Pug from "pug";
import fs from "fs";
import htmlPDF from "html-pdf";
import GenContent from './genContent.js';
import Config from "./config/index.js";
const time_start = Moment("2018-7-1"),
  time_end = Moment("2018-12-31");

  console.log(time_start.format('MMDD'))
  // time_start.add(1, 'M')
  time_start.endOf("Month").date();
  console.log(time_start.format('MMDD'))

// const options = {
//   // format: "A4",
//   width: "20.99cm",
//   height: "29.7cm",
//   border: {
//     top: "2.1cm",
//     bottom: "2.1cm",
//     left: "1.95cm",
//     right: "1.95cm"
//   }
// };
// let htmls = '';
// let datas = []
// let { time_start, time_end, interval, topics,share } = Config;
// const topic = topics[0];

// function prepareData(records) {
//   const __dirname = process.env.PWD;
//   console.log(__dirname);
//   records.forEach(r => {
//     if (r.img) r.img = `file://${__dirname}/config/img/${r.img}`;
//     console.log(r.img);
//   });
//   return records;
// }
// topics.forEach(t => t.records= prepareData(t.records))
// share = prepareData(share)
// for (let i = 0; i < 2; i++){
//   const data = {
//     topic: topic.name,
//     time: ["108年03月16日", "108年03月31日"],
//     content: GenContent.getContent(topic, share)
//   };
//   // console.log(data, data.content)
//   datas.push(data)
// }
// htmls = Pug.renderFile("template.pug", {datas})
// // const htmlFile = Pug.renderFile("template.pug", data);
// fs.writeFileSync("./test.html", htmls);
// htmlPDF.create(htmls, options).toFile(`test.pdf`, function(err, res) {
//   if (err) return console.log(err);
//   console.log(res);
// });
// for (let i = 1, time = time_start; time <= time_end; i++){
//     const year = time.year(),
//       month = time.month()+1;
//     if (i % 2) {

//         console.log(`${year}年${month}月1日`, `${year}年${month}月15日`);
//     } else {
//         console.log(`${year}年${month}月16日`, `${year}年${month}月${time.endOf('Month').date()}日`);
//         time.add(1, 'months');

//     }
// }
