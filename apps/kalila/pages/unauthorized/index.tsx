import './index.module.scss';

/* eslint-disable-next-line */
export interface UnauthorizedProps {}

export function Unauthorized(props: UnauthorizedProps) {
  return (
    <div>
      <h1>Welcome to Unauthorized!</h1>
    </div>
  );
}

export default Unauthorized;
