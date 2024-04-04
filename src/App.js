import { useState } from "react";
import Body from "./components/Body";
import Header from "./components/Header";
import Line from "./components/Line";

function App() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (value) => {
    setInputValue(value);
  };
  return (
    <div className="">
      <div className="App">
        <Header onInputChange={handleInputChange} />
        <Line />
        <Body inputValue={inputValue} />
      </div>
    </div>
  );
}

export default App;
