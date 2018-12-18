import { wxObserver, mapData } from "../mobx-wxapp";
import globalStore from "../stores/global.store";
import indexStore from "../stores/index.store";
import { observable } from '../mobx';

const data = observable({
  title: 'aaa',
  seconds: 0,
  list: [],
  get color() {
    return this.seconds % 2 === 0 ? "red" : "green";
  }
});

Page({
  onLoad() {
    wxObserver(this, () => {
      return mapData(data);
    }, {
      afterSetData(data) {
        console.log(data);
      }
    });
  },
  add() {
    data.seconds++;
  },
  addList() {
    data.list.push(Math.random());
  },
  change() {
    data.list[1] = 2;
  },
  remove() {
    data.list.splice(1, 1);
    this.$nextTick(() => {
      console.log('@@@');
    })
  }
});
