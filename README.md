# ‎Что это?

Крайне упрощенный фреймворк с самодельным Virtual DOM и поддержкой реактивности.

# И зачем?

Точно не для коммерческого использования :) Я люблю изучать то, как та или иная технология работает «изнутри», поэтому мне было интересно попробовать написать свою простенькую реализацию React/Vue.

# Обзор

Насколько известно, Virtual DOM — это копия реального DOM, только в виде JS-объектов. `Velvet` может рендерить эти объекты в HTML:

```javascript
h("div", { id: "app" }, "Hello World!") // --> <div id="app">Hello World!</div> 
```

Стейты задаются следующим образом:

```javascript
const state = reactive({
  count: 0,
});
```

Есть аналог «компонентов» (по сути, лишь обёртка):

```javascript
const Button = (text: string, onclick: () => string | number) => {
  return h("button", { onclick }, text);
};

// пример вызова
const render = () =>
  h("div", { class: "container" }, [
    Button("+1", () => (state.count += 1)),
    Button("-1", () => (state.count -= 1)),
  ]);
```

...и аж целый один хук (привет, реакт):

```javascript
let previousNode: VNode | null = null;
const app = document.getElementById("app");

watchEffect(() => {
  if (!previousNode) {
    previousNode = render(`${state.count}`);
    mount(previousNode, app);
  } else {
    const newNode = render(`${state.count}`);
    patch(previousNode, newNode);
    previousNode = newNode;
  }
});
```


# Примеры

См. папку `examples`.

# Как запустить

### `yarn install`
### `yarn start`
