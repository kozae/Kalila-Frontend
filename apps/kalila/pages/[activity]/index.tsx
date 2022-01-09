import './index.module.scss';
import {useRouter} from "next/router";



export function Activity() {
  const router = useRouter()
  const { activity } = router.query

  return <p>Activity: {activity}</p>

}

export default Activity;
