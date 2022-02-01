export abstract class KalilaDocument {
  public Id: string | undefined;
  abstract validationSchemaFactory(editors: string[], validators: Record<any, (value: any) => Promise<boolean>>);
  abstract CreateAdminUpdate(oldValue: any, mode: 'one' | 'many' | 'filtered'): any;
}
