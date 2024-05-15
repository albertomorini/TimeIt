import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { createOutline, listOutline, settingsOutline } from 'ionicons/icons';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import TodoList from './pages/TodoList';
import Settings from './pages/Settings';
import NewActivity from './pages/NewActivity.jsx';

setupIonicReact();


const App: React.FC = () => {
  
  function returnToList() {
    window.location="/todoList"
  }
  
  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle mode={"ios"}>Time It</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/todoList">
              <TodoList />
            </Route>
            <Route path="/newActivity">
              <NewActivity 
                returnToList={() => returnToList()}
              />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route exact path="/">
              <Redirect to="/todoList" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="todoList" href="/todoList">
              <IonIcon aria-hidden="true" icon={listOutline} />
              <IonLabel>List</IonLabel>
            </IonTabButton>
            <IonTabButton tab="newActivity" href="/newActivity">
              <IonIcon aria-hidden="true" icon={createOutline} />
              <IonLabel>New</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              <IonIcon aria-hidden="true" icon={settingsOutline} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
