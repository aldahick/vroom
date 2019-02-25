import { IndexScene } from "./scene";
import { LoginScene } from "./scene/login";
import { RegisterScene } from "./scene/register";

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
    component: RegisterScene,
    route: "/register",
    isPrivate: false
  }
];

export default scenes;
