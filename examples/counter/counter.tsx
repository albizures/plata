import * as P from "../../src";

const Counter = () => {
  const ref = P.createRef();
  let counter = 0;

  const onClick = () => {
    counter = counter + 1;

    P.replaceContent(ref, counter);
  };

  return (
    <div>
      <span ref={ref}>{counter}</span>
      <button onClick={onClick}>click me</button>
    </div>
  );
};

P.render(<Counter />, document.getElementById("root"));
