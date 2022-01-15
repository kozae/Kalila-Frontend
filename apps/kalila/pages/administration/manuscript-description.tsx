import {withAdminLayout} from "./_layout";
import {useAdminDocuments} from "../../../../libs/ui/administration/src/lib/store/hooks";
import {useApiClient} from "@frontend/shared-ui";
import axios from "axios";

export function MSDAdministration() {
  useAdminDocuments('ManuscriptDescription')
  return (
    <>
      <h1>Welcome to MSD Administration!</h1>
    </>
  );
}


export default withAdminLayout(MSDAdministration, 'key1')
