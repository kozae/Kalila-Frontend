export type validationFn = (value: any) => Promise<boolean>;
export type validationWithParentFn = (
  value: any,
  parent: any
) => Promise<boolean>;

export abstract class KalilaDocument {
  public Id: string | undefined;
  public Editor: string = '';
  public EditionProgress: string = 'not started';
  public CreatedAt: Date | undefined = undefined;
  public Version: Date | undefined = undefined;

  abstract validationSchemaFactory(
    editors: string[],
    validators: Record<any, validationFn | validationWithParentFn>
  );

  abstract CreateAdminUpdate(
    oldValue: any,
    mode: 'one' | 'many' | 'filtered'
  ): Promise<any>;

  protected CommonAdminUpdate() {
    return {
      Editor: this.Editor,
      EditionProgress: this.EditionProgress,
    };
  }
}
