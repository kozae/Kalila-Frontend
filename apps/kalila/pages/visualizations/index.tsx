import "./index.module.scss";
import { useNavbarMessage, withTransition } from "@frontend/shared-ui";
import { DisseminationMap } from "@frontend/ui/visualizations/dissemination-map";

export function Visualizations() {
  useNavbarMessage(["Visualizations", undefined]);
  return <DisseminationMap />;
}

export default withTransition(Visualizations, {});
