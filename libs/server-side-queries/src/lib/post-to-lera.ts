import * as fs from 'fs';
import { exec } from 'child_process';
import { LeraDocument } from '@frontend/domain';

export async function postToLera(documents: LeraDocument[]) {
  const authenticity_token = '4bfe4908136da376977bc10a0053c268';
  const lera_user = 'cedis';
  const lera_password = '723e5b62a5042';
  const url = 'https://kalila.uzi.uni-halle.de/api/import';

  fs.writeFileSync('temp.json', JSON.stringify({ documents: documents }));

  await exec(
    `curl ${url} -u '${lera_user}:${lera_password}' --form "data=@temp.json" --form authenticity_token="${authenticity_token}"`,
    (err, stdout, stderr) => {
      console.log({ err });
      console.log({ stdout });
      console.log({ stderr });
    }
  );
}
