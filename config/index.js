import Moment from "moment";

import topics from './topics.js';
import share from './share.js';
export default {
  time_start: Moment("2019-10-01"),
  time_end: Moment("2019-12-31"),
  interval: 14, //報告週期（天數）
  topics,
  share,
};