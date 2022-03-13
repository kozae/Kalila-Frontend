import { useState } from 'react';

export interface IEditor {
  username: string;
  name: string;
}

// todo move confidential information to an env file
export function useRegisteredEditors(): IEditor[] {
  const [editors, setEditors] = useState<IEditor[]>([
    {
      username: 'mk',
      name: 'Mahmoud Kozae',
    },
    {
      username: 'ds',
      name: 'Dima Sakran',
    },
  ]);
  // todo cache the editors on the server using the rest worker
  // useEffect(() => {
  //   axios.get(`https://idp.kozae.de/auth/admin/realms/kalila/users`, {
  //     headers: {
  //       "client_id": "token_client",
  //       "grant_type": "client_credentials",
  //       "client_secret": "b7867c89-7ea9-4f01-aed9-05568621e3f7"
  //     }
  //   }).then(r => {
  //     console.log(r)
  //   })
  //
  // }, [])

  return editors;
}
