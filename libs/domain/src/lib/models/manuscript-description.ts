import {
  KalilaDocument,
  validationFn,
  validationWithParentFn,
} from './kalila-document';

export interface BookCreation {
  Title: string;
  Author: string;
}

export interface ManuscriptNote {
  Name: string;
  Date: string;
}

export interface KwDProperName {
  Name: string;
  Occurence: string;
}

export class ManuscriptDescription extends KalilaDocument {
  Siglum: string;
  AttachmentsPdfFileUrl: string;
  AdditionalCommentary: string;
  CatalogueTitle: string;
  CatalogueCommentary: string;
  LocationCity: string;
  LocationLibrary: string;
  LocationManuscriptId: string;
  LocationCommentary: string;
  DatingAccuracy: string;
  DatingGregorianCentury: number;
  DatingHijriCentury: number;
  DatingGregorianYear: number;
  DatingHijriYear: number;
  DatingGregorianDate: string;
  DatingHijriDate: string;
  DatingCommentary: string;
  PreservationStatus: string;
  PreservationMissingParts: string[];
  PreservationRestoredParts: string[];
  PreservationCommentary: string;
  BindingType: string;
  BindingPeriod: string;
  BindingAdditionalFeatures: string;
  BindingCommentary: string;
  PaginationPresent: string[];
  PaginationUsed: string;
  PaginationCommentary: string;
  MTMIsMultipleTextManuscript: boolean;
  MTMCopiedWith: BookCreation[];
  MTMIntegratedWith: BookCreation[];
  MTMCommentary: string;
  CompositeManuscriptIsCompositeManuscript: boolean;
  CompositeManuscriptBoundWith: BookCreation[];
  CompositeManuscriptCommentary: string;
  LayoutFrame: boolean;
  LayoutCatchwords: boolean;
  LayoutLinesPerPage: number;
  LayoutChapterTitles: string[];
  LayoutTextDivisionSymbols: string[];
  LayoutHighlightedText: string[];
  LayoutCommentary: string;
  IllustrationsPresence: string;
  IllustrationsLegend: string;
  IllustrationsCommentary: string;
  ScriptType: string;
  ScriptHands: string;
  ScriptExecution: string;
  ScriptSize: string;
  ScriptLineSpacing: string;
  ScriptWordSpacing: string;
  ScriptStrokeDirection: string;
  ScriptLowerCurves: string;
  ScriptStrokeThickness: string;
  ScriptBaseline: string;
  ScriptLetterDiacritics: string;
  ScriptVowelMarkers: string;
  ScriptPresentAdditionalWritingSigns: string[];
  ScriptCommentary: string;
  OrthographyDDhShifts: boolean;
  OrthographyZaDadShifts: boolean;
  OrthographySinSadShifts: boolean;
  OrthographyThaTaShifts: boolean;
  OrthographyUseOfHamza: string;
  OrthographyCommentary: string;
  LanguageRelaxedGrammar: string;
  LanguagePseudoCorrections: string;
  LanguageDialectalFeatures: string;
  LanguageSyntax: string[];
  LanguageLexicon: string[];
  LanguageMorphology: string[];
  LanguageCommentary: string;
  ManuscriptNotesFrequency: string;
  ManuscriptNotesPlace: string;
  ManuscriptNotesNamesAndDatesContained: ManuscriptNote[];
  ManuscriptNotesCommentary: string;
  MarginaliaCorrections: string;
  MarginaliaCommentary: string;
  ProductionCopyist: string;
  ProductionNamesOfCopyists: string[];
  ProductionPatron: string;
  ProductionNamesOfPatrons: string[];
  ProductionCommentary: string;
  IncipitIsPresent: boolean;
  IncipitType: string;
  IncipitExtensiveOrUnusual: boolean;
  IncipitCommentary: string;
  ExplicitIsPresent: boolean;
  ExplicitType: string;
  ExplicitExtensiveOrUnusual: boolean;
  ExplicitCommentary: string;
  TableOfContentsNumber: string;
  TableOfContentsPlace: string;
  TableOfContentsCommentary: string;
  KwDProperNames: KwDProperName[];
  KwDChapterSequenceType: string;
  KwDChapterSequenceIsVariant: boolean;
  KwDChapterSequence: string;
  KwDPrefaces: string[];
  KwDSpuriousChapters: string[];
  KwDCommentary: string;
  RelationToOtherManuscriptsIm: string;
  RelationToOtherManuscriptsLv: string;
  RelationToOtherManuscriptsIncipitCloseTo: string[];
  RelationToOtherManuscriptsTocCloseTo: string[];
  RelationToOtherManuscriptsExplicitCloseTo: string[];
  RelationToOtherManuscriptsFormulationMostlyCloseTo: string[];
  RelationToOtherManuscriptsVerbatimSimilarityWith: string[];
  RelationToOtherManuscriptsSharedLacunaeOrErrorsWith: string[];
  RelationToOtherManuscriptsLayoutCloseTo: string[];
  RelationToOtherManuscriptsImageCycleCloseTo: string[];
  RelationToOtherManuscriptsShowsCrossCopying: string;
  RelationToOtherManuscriptsCommentary: string;
  RedactionPerformance: string;
  RedactionLacunae: string;
  RedactionReinterpretedRasm: string;
  RedactionRewriting: string;
  RedactionCommentary: string;

  constructor() {
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
