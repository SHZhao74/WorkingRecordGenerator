import Moment from "moment";

import topics from './topics.js';
import share from './share.js';
export default {
  // pdf, docx, both
  outFormat: 'both',
  imgPath: './config/img/',
  IMG_MAX_HEIGHT: 320,
  IMG_MAX_WIDTH: 580,
  time_start: Moment("2019-10-01"),
  time_end: Moment("2019-12-31"),
  interval: 14, //報告週期（天數）
  topics,
  share,
};