import { withAdminLayout} from "./_layout";

export function CategoricalAttributesAdministration() {
  return (
    <>
      <h1>Welcome to CA Administration!</h1>
    </>
);
}


export default withAdminLayout(CategoricalAttributesAdministration, 'key3')
