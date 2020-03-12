/**
 * @example {
 *  name: "A1.旅運資訊服務平台", //主題名稱
    many: 9, //人數 or 份數
    NO: [34, 35, 36, 37, 38, 39, 40, 41, 42], //人員編號 如果有
    records:[{
      record: '', //工作記錄
      img: '', //如果有圖片搭配，填檔案名稱(需放在 config/img/ 底下)
      weight: Number //隨機的權重
    }]
 * }
 *  
 */
// import A1_records from './A1';
// const A1_records = require('./A1');
// const A2_records = require('./A2');
// const A3_records = require('./A3');
import A1_records from './A1.js';
import A2_records from './A2.js';
import A3_records from './A3.js';
import C_record from './C.js';

const api = [
  {
    record: "設計Open API: 停車場基本資料與剩餘車位數。",
    img: "A1_06.png",
    weight: 0.8
  },
  {
    record: "設計Open API: 接駁巴士行經路段行車速率。",
    img: "A1_07.png",
    weight: 0.8
  }
];

const A_RECORDS = [...A1_records, ...A2_records, ...A3_records, ...api]
const C_RECORDS = [...C_record, ...api]
export default [
  // {
  //   name: "A1.旅運資訊服務平台", //Ａ1.1-1、A1.2
  //   many: 9, //人數 or 份數
  //   NO: [34, 35, 36, 37, 38, 39, 40, 41, 42], //人員編號 如果有
  //   records: A_RECORDS
  // },

  // {
  //   name: "A2.觀光接駁巴士營運車上連網服務整合", //Ａ1.1-1、A1.2
  //   many: 6, //人數 or 份數
  //   NO: [23, 69, 70, 71, 72, 73], //人員編號 如果有
  //   records: A_RECORDS
  // },
  // {
  //   name: "A3.在地旅運資訊發佈", //Ａ1.1-1、A1.2
  //   many: 9, //人數 or 份數 (3,4兩位調職)
  //   NO: [9, 10, 11, 12, 13, 14, 15, 16, 17], //人員編號 如果有
  //   records: A_RECORDS
  // },
  // {
  //   name: "C1.旅運及觀光資訊推播", //C1.2 完成多元支付與消費者分析回饋
  //   many: 5,
  //   NO: [58, 59, 60, 61, 62],
  //   records: C_RECORDS
  // },
  {
    name: "C2.觀光旅運數據應用", //C2.3 完成大型活動行銷成效分析報告(縣府舉辦之大型活動)
    many: 9, //31調職
    NO: [29, 30, 32, 33, 64, 65, 66, 67, 68],
    records: C_RECORDS
  }
];
