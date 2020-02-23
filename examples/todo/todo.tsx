import * as H from "../../src";

interface Todo {
  name: string;
}

interface PropTypes {
  name: string;
  onDone: (ref: H.Ref) => void;
}

const Todo = (props: PropTypes) => {
  const ref = H.createRef();
  return (
    <li ref={ref}>
      {props.name}
      <button onClick={() => props.onDone(ref)}>done</button>
    </li>
  );
};

const Counter = () => {
  const listRef = H.createRef();
  const inputRef = H.createRef<HTMLInputElement>();
  let todos: Todo[] = [];

  const onAdd = () => {
    const name = inputRef.current.value;

    if (name === "") {
      return;
    }

    const todo = { name };
    todos.push(todo);

    const onDone = (ref: H.Ref) => {
      const index = todos.indexOf(todo);
      todos.splice(index, 1);
      H.remove(ref);
    };

    H.append(listRef, <Todo onDone={onDone} name={name} />);
    inputRef.current.value = "";
  };

  return (
    <div>
      <div>
        <label htmlFor="name">Name</label>
        <input ref={inputRef} type="text" id="name" />
      </div>
      <button onClick={onAdd}>add</button>
      <ul ref={listRef}></ul>
    </div>
  );
};

H.render(<Counter />, document.getElementById("root"));
