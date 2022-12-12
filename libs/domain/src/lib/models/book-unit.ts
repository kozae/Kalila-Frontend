import {
  KalilaDocument,
  validationFn,
  validationWithParentFn,
} from './kalila-document';

export interface IBookUnit {
  Id: string;
  Order: number[];
  NumericalOrder: number;
  FrameTags: string[];
  Divider: boolean;
  Variant: string;
  Title: string;
  Topics?: string[];
  Motifs?: string[];
  Editor: string;
  EditionProgress: string;
}

export class BookUnit extends KalilaDocument {
  constructor(
    public Id: string | undefined = undefined,
    public Order: number[] | undefined = undefined,
    public Divider: boolean = false,
    public Title: string | undefined = '',
    public Variant: string | undefined = '',
    public FrameTags: string[] | undefined = undefined,
    public Topics: string[] | undefined = undefined,
    public Motifs: string[] | undefined = undefined,
    public Editor: string = '',
    public EditionProgress: string = 'in work',
    public CreatedAt: Date | undefined = undefined,
    public Version: Date | undefined = undefined
  ) {
    super();
  }

  CreateAdminUpdate(
    oldValue: any,
    mode: 'one' | 'many' | 'filtered'
  ): Promise<any> {
    return Promise.resolve(undefined);
  }

  validationSchemaFactory(
    editors: string[],
    validators: Record<any, validationFn | validationWithParentFn>
  ) {}
}

export interface IStructureUpdate {
  Title?: string;
  Variant?: string;
  NewOrder?: number[];
  OldOrder?: number[];
}

export interface IFrameUpdate {
  Order?: number[];
  FrameTags?: string[];
  Motifs?: string[];
  Topics?: string[];
}
