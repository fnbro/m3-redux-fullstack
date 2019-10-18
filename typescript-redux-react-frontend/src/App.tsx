import React from 'react';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import ShowAssets from './components/ShowAssets';
import { Switch, Route } from 'react-router-dom';
import { IAction, ActionType } from './framework/IAction';
import { IAssetData, IState } from './state/appState'
import axios from 'axios';
import { reducerFunctions } from './reducer/appReducer';

import { IWindow } from './framework/IWindow'
declare let window: IWindow;

interface IProps {
  stateCounter: number
}

export interface IAssetsLoadedAction extends IAction {
  assets: IAssetData[]
}
reducerFunctions[ActionType.server_called] = function (newState: IState, action: IAction) {
  newState.UI.waitingForResponse = true;
  return newState;
}
reducerFunctions[ActionType.add_assets_from_server] = function (newState: IState, action: IAssetsLoadedAction) {
  newState.UI.waitingForResponse = false;
  newState.BM.assets = action.assets;
  return newState;
}
export interface IAssetData {
  _id: string;
  asset_name: string;
  asset_value: number;

}
export default class App extends React.PureComponent<IProps> {

  componentDidMount() {
    const uiAction: IAction = {
      type: ActionType.server_called
    }
    window.CS.clientAction(uiAction);
    axios.get('http://localhost:8080/assets/read').then(response => {
      console.log("this data was loaded as a result of componentDidMount:");
      console.log(response.data);
      const responseAction: IAssetsLoadedAction = {
        type: ActionType.add_assets_from_server,
        assets: response.data as IAssetData[]
      }
      window.CS.clientAction(responseAction);
    }).catch(function (error) { console.log(error); })
  }

  saveAssetToDatabase(asset:any) {
    axios.post('http://localhost:8080/assets/add', asset)
      .then(res => console.log(res.data));
  }




  render() {
    window.CS.log("App --> render()")
    return (
      <>
        <NavBar />
        <Switch>
          <Route path="/showassets" component={ShowAssets} />
          <Route path="/register" component={Register} />
          <Route path="/" component={Login} />
        </Switch>

      </>
    );
  }

}

