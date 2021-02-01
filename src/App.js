import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Questions from './components/Questions';
import Forms from './components/Forms';
import Response from './components/Response';
import Success from './components/Success';
import Responses from './components/Responses';

function App() {
  return (
    <Router>
        <h1>Project LVTIF</h1>
       <Switch>
          <Route path="/forms/:id/questions" component={Questions}/>
          <Route path="/forms/:id/responses/new/success" component={Success}/>
          <Route path="/forms/:id/responses/new" component={Response}/>
          <Route path="/forms/:id/responses" component={Responses}/>
          <Route path="/forms" component={Forms}/>

        </Switch>
    </Router>
  );
}

export default App;
