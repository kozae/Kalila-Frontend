import {adminPageTransitionProps, withAdminLayout} from "./_layout";
import {withTransition} from "@frontend/shared-ui";

export function CategoricalAttributesAdministration() {
  return (
    <>
      <h1>Welcome to CA Administration!</h1>
    </>
);
}


export default withAdminLayout(CategoricalAttributesAdministration, 'key3')
