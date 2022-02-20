import { ActiveWorkspace } from '../../text-editing-workspace-context';
import { DescriptionFacsimileSpace } from './description-facsimile-space';

export interface IFacsimileSpaceProps {
  width: number;
  height: number;
  url: string;
  activeWorkspace: ActiveWorkspace;
}

const Components: Record<
  ActiveWorkspace,
  (props: IFacsimileSpaceProps) => JSX.Element
> = {
  description: DescriptionFacsimileSpace,
  layout: DescriptionFacsimileSpace,
  lines: DescriptionFacsimileSpace,
  segmentation: DescriptionFacsimileSpace,
  transcription: DescriptionFacsimileSpace,
};

export const FacsimileSpaceSelector = ({
  activeWorkspace,
  ...props
}: IFacsimileSpaceProps) =>
  Components[activeWorkspace]({ ...props, activeWorkspace });
