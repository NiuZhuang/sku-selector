import "./App.css";
import SkuSelector from "./skuSelector/index";
import { mockSkuData } from "./mock/index";

function App() {
  return (
    <div className="App">
      <SkuSelector {...mockSkuData} />
    </div>
  );
}

export default App;
