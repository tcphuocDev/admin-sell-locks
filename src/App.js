import "./App.css";
import "braft-editor/dist/index.css";
import { useStore } from "./redux/store";
import { Provider } from "react-redux";
import routes from "./router";
import { useRoutes } from "react-router-dom";

function App(props) {
  const store = useStore(props.initialReduxState);

  return <Provider store={store}>{useRoutes(routes)}</Provider>;
}

export default App;
