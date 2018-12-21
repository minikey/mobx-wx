import { wxObserver, mapData } from "../mobx-wxapp";
import globalStore from "../stores/global.store";
import indexStore from "../stores/index.store";
import { observable } from '../mobx';

const store = observable({
  title: 'aaa',
  seconds: 0,
  list: [],
  get color() {
    return this.seconds % 2 === 0 ? "red" : "green";
  }
});

Page({
  data: {
    name: 'mobx测试'
  },
  onLoad() {
    wxObserver(this, () => {
      return mapData(store);
    }, {
      afterSetData(data) {
        console.log(data);
      }
    });
  },
  add() {
    store.seconds++;
  },
  addList() {
    store.list.push(Math.random());
  },
  change() {
    store.list[1] = 2;
  },
  remove() {
    store.list.splice(1, 1);
    this.$nextTick(() => {
      console.log('@@@');
    })
  }
});
