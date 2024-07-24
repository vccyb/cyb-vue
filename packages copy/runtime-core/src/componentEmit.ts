export function emit(instance, event, ...args) {
  const { props } = instance;
  console.log("emit", event);

  // add => Add
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  // add-value => addValue
  const camelize = (str: string) => {
    return str.replace(/-(\w)/g, (_, s: string) => {
      return s ? s.toUpperCase() : "";
    });
  };

  // Add => onAdd
  const toHandlerKey = (str: string) => {
    return str ? "on" + capitalize(camelize(str)) : "";
  };
  const hanlderKey = toHandlerKey(event);
  const hanlder = props[hanlderKey];

  hanlder && hanlder(...args);
}
