import { IndexScene } from "./scene";
import { CongressScene } from "./scene/gov/congress";
import { LoginScene } from "./scene/login";
import { LogoutScene } from "./scene/logout";
import { RegisterScene } from "./scene/register";
import { SettingsScene } from "./scene/settings";

type SceneDefinition = {
  component: React.ComponentType<any>;
  route: string;
  isPrivate: boolean;
};

const scenes: SceneDefinition[] = [
  {
    component: IndexScene,
    route: "/",
    isPrivate: true
  },
  {
    component: LoginScene,
    route: "/login",
    isPrivate: false
  },
  {
    component: LogoutScene,
    route: "/logout",
    isPrivate: true
  },
  {
    component: RegisterScene,
    route: "/register",
    isPrivate: false
  },
  {
    component: SettingsScene,
    route: "/settings",
    isPrivate: true
  },
  {
    component: CongressScene,
    route: "/gov/congress",
    isPrivate: true
  }
];

export default scenes;
