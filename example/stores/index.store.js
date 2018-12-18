import { observable, computed, action, decorate } from "../mobx";

class Store {
  seconds = 0;
  list = [];
  get color() {
    return this.seconds % 2 === 0 ? "red" : "green";
  }
  tick = () => {
    this.seconds += 1;
  };
}
decorate(Store, {
  seconds: observable,
  color: computed,
  tick: action,
  list: observable
});

export default new Store();
