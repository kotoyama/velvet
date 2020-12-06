import { watchEffect } from "reactivity/effect";
import { reactive } from "reactivity/reactive";

const CountView = (): void => {
  const state = reactive({
    count: 1,
    name: "Alex",
  });

  let key = 100;

  watchEffect(() => console.log("🦄 state changed", state.count, state.name));
  watchEffect(() => console.log("no reactive"));
  watchEffect(() =>
    key >= 100 ? console.log("test") : console.log("name is " + state.name)
  );
  watchEffect(() =>
    key >= 99 ? key-- && console.log(state.name) : console.log("test2")
  );

  setTimeout(() => {
    state.count += 1;
    state.name = "Mark";
  }, 3000);
  setTimeout(() => {
    state.count += 1;
  }, 5000);
  setTimeout(() => {
    state.count += 1;
    state.name = "Maria";
  }, 7000);
};

export default CountView;
