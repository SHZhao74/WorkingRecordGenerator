import path from "path";

export default class GenContent {
  /**
   *
   * @param {Array} items list of items
   * @param {Array} weights weight list of items
   */
  static weightedRandom(items, weights) {
    const rand = () => this.rand(0, weights[weights.length - 1]);
    const random_num = Math.sqrt(rand() * rand());
    let index = weights.findIndex(w => w >= random_num);
    // console.log({random_num, weights});
    if (index === -1) index = weights.length - 1;
    return { record: items[index], index };
  }
  static rand(min, max) {
    return Math.random() * (max - min + 1) + min;
    // return Math.floor(Math.random() * (max - min+1) + min);
  }
  static genWeightList(records) {
    const wList = [];
    records.reduce((prev, cur, i) => {
      wList.push(prev + cur.weight);
      return prev + cur.weight;
    }, 0);
    return wList;
  }
  static shuffle(array = []) {
    //Fisher-Yates Shuffle
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  // static prepareData(records) {
  //   const __dirname = process.env.PWD;
  //   console.log(__dirname);
  //   records.forEach(r => {
  //      if (r.img)
  //        r.img = `file://${__dirname}/config/img/${r.img}`;
  //     console.log(r.img);
  //   });
  //   return records;
  // }
  /**
   *
   * @param {Object} topic
   * @param {Array} share
   * @return {Array}
   */
  static getContent(topic, share, time) {
    let records = JSON.parse(JSON.stringify(share.concat(topic.records)));
    // records = this.prepareData(records);
    let wList = this.genWeightList(records);
    const result = [],
      qty = 3;

    records = this.shuffle(records);
    for (let i = 0; i < qty; i++) {
      const { record, index } = this.weightedRandom(records, wList);
      
      if (Array.isArray(record.img)) {
        const j = record.month.findIndex(m => m === time.month() + 1);
        console.log(record.month, time.month() + 1, j);
        if(j!== -1){
        result.push({
          record: record.record,
          img: record.img[j]
        });
          console.log(record.img[j], j);
        record.img.splice(j, 1);
        record.month.splice(j, 1);
        if (record.img.length === 0) records.splice(index, 1);
        }
        else {// random draw again
          i--;
          continue;
        }
      } else {
        records.splice(index, 1);
        wList = this.genWeightList(records);
        // console.log({ record, index });
        result.push(record);
      }
    }
    // console.log({result})
    return result;
  }
}
