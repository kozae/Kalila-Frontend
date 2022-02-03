import {withAdminLayout} from "@frontend/ui/administration";

export function CategoricalAttributesAdministration() {
  return (
    <>
      <h1>Welcome to CA Administration!</h1>
    </>
);
}


export default withAdminLayout(CategoricalAttributesAdministration, 2)
