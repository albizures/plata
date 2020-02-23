import * as P from "../../src";

interface Todo {
  name: string;
}

interface PropTypes {
  name: string;
  onDone: (ref: P.Ref) => void;
}

const Todo = (props: PropTypes) => {
  const ref = P.createRef();
  return (
    <li ref={ref}>
      {props.name}
      <button onClick={() => props.onDone(ref)}>done</button>
    </li>
  );
};

const Counter = () => {
  const listRef = P.createRef();
  const inputRef = P.createRef<HTMLInputElement>();
  let todos: Todo[] = [];

  const onAdd = () => {
    const name = inputRef.current.value;

    if (name === "") {
      return;
    }

    const todo = { name };
    todos.push(todo);

    const onDone = (ref: P.Ref) => {
      const index = todos.indexOf(todo);
      todos.splice(index, 1);
      P.remove(ref);
    };

    P.append(listRef, <Todo onDone={onDone} name={name} />);
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

P.render(<Counter />, document.getElementById("root"));
