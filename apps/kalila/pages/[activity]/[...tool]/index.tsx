import './index.module.scss';
import {useRouter} from "next/router";

/* eslint-disable-next-line */
export interface ToolProps {}

export function Tool(props: ToolProps) {
  const router = useRouter()
  const {asPath } = router


  return <p>path: {asPath}</p>
}

export default Tool;
