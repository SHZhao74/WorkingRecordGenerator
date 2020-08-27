import Pug from "pug";
import htmlPDF from "html-pdf";
import htmlDocx from "html-docx-js";
import fs from "fs";
import mime from "mime-types";
import resizeImg from "resize-img";
import sizeOf from "image-size";
import GenContent from "./genContent.js";
import Config from "./config/index.js";

const {
  outFormat,
  imgPath,
  IMG_MAX_HEIGHT,
  IMG_MAX_WIDTH,
  time_start,
  time_end,
  interval,
} = Config;
let { topics, share } = Config;
// const time_step = 86400000 * interval;
//PDF options
const options = {
  // format: "A4",
  // width: "20.99cm",
  // height: "29.7cm",
  border: {
    top: "0.15cm",
    bottom: "0.15cm",
    left: "0.19cm",
    right: "0.19cm",
  },
};
async function getImgBase64(img, resize = true) {
  const fullPath = `${imgPath}${img}`;

  let imgBuffer = fs.readFileSync(fullPath);
  const resolution = sizeOf(imgBuffer);
  if (resolution.width > IMG_MAX_WIDTH) {
    imgBuffer = await resizeImg(imgBuffer, { width: IMG_MAX_WIDTH });
    resolution.width = IMG_MAX_WIDTH;
  }
  if (resolution.height > IMG_MAX_HEIGHT){
    imgBuffer = await resizeImg(imgBuffer, { height: IMG_MAX_HEIGHT });
  }
  return (
    "data:" + mime.lookup(fullPath) + ";base64," + imgBuffer.toString("base64")
  );
}
/** 資料前處理 */
async function prepareData(records) {
  const __dirname = process.env.PWD;
  for (const r of records) {
    //圖片轉成base64
    if (r.img)
      if (Array.isArray(r.img))
        for (let i = 0; i < r.img.length; i++) {
          r.img[i] = await getImgBase64(r.img[i]);
        }
      else {
        r.img = await getImgBase64(r.img);
      }
  }
  return records;
}
/**get 檔案名稱的時間起訖 (轉民國年) */
function timeRangeString(start, end) {
  return `${start.year() - 1910}${start.format("MMDD")}-${
    end.year() - 1910
  }${end.format("MMDD")}`;
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
      `${year}年${month}月${time.endOf("Month").date()}日`,
    ];
  }
}

const genPDF = (htmlFile, filePath) =>
  htmlPDF.create(htmlFile, options).toFile(filePath, (err, res) => {
    console.log(res.filename);
  });
const genDocx = (htmlFile, filePath) => {
  const docxFile = htmlDocx.asBlob(htmlFile, {
    margins: {
      top: 720,
      bottom: 720,
      right: 500,
      left: 500,
    },
  });
  fs.writeFile(filePath, docxFile, (err) => {
    err && console.error(err);
  });
};

(async function Main() {
  try {
    fs.rmdirSync("./dist", { recursive: true });
    const timeString = timeRangeString(time_start, time_end);
    for (const t of topics) {
      t.records = await prepareData(t.records);
    }
    share = await prepareData(share);
    //each topic
    topics.forEach(async (topic, index) => {
      const folderPath = `./dist/${topic.name}(${topic.many}人)`;
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(topic.name);

      //each people
      for (let i = 0; i < topic.many; i++) {
        const datas = []; //所有頁面的資料
        const NO = topic.NO ? topic.NO[i] : undefined; //如果人員有編號

        //For example: ./dist/A1.巴拉巴拉主題/NO34_1080701-1081231.pdf
        const filePath = `${folderPath}/${NO ? `NO${NO}_` : ""}${timeString}`;
        //each period
        for (let i = 1, time = time_start.clone(); time <= time_end; i++) {
          const data = {
            topic: topic.name,
            time: getPeriodTime(time, i),
            content: GenContent.getContent(topic, share, time),
          };
          if (i % 2 === 0) time.add(1, "M");
          datas.push(data);
        }

        const htmlFile = Pug.renderFile("template.pug", { datas });
        process.env.NODE_ENV == "dev" &&
          fs.writeFile("./dist/debug.html", htmlFile, (err) => {
            err && console.error(err);
          });

        switch (outFormat) {
          case "both":
            genPDF(htmlFile, filePath + ".pdf");
            genDocx(htmlFile, filePath + ".docx");
            break;
          case "pdf":
            genPDF(htmlFile, filePath + ".pdf");
            break;
          case "docx":
            genDocx(htmlFile, filePath + ".docx");
            break;
        }
        console.info(filePath);
      }
      console.log("Done");
    });
  } catch (err) {
    console.error(err);
  }
})();
