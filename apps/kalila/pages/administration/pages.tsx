import {withAdminLayout} from "@frontend/shared-ui";

export function PagesAdministration() {
  return (
    <>
      <h1>Welcome to Pages Administration!</h1>
    </>
  );
}


export default withAdminLayout(PagesAdministration, 'key2')
