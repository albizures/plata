import * as H from "../../src";

const Counter = () => {
  const ref = H.createRef();
  let counter = 0;

  const onClick = () => {
    counter = counter + 1;
    console.log("lelelel");

    H.replaceContent(ref, counter);
  };

  return (
    <div>
      <span ref={ref}>{counter}</span>
      <button onClick={onClick}>click me</button>
    </div>
  );
};

H.append(<Counter />, document.getElementById("root"));
