export enum TokenTypes {
  XmlStart = 'XmlStart',
  XmlContent = 'XmlContent', // what should not be displayed
  XmlEnd = 'XmlEnd',
  Space = 'Space',
  LineBreak = 'LineBreak',
  Paragraph = 'Paragraph',
  PageBreak = 'PageBreak',
  Word = 'Word',
  Number = 'Number',
  Punctuation = 'Punctuation',
  WordJoin = 'WordJoin',
  Other = 'Other',
  Macro = 'Macro', // any inline symbols (e.g. page numbers)
  Cut = 'Cut',
  Merge = 'Merge',
}

export interface LeraToken {
  type: TokenTypes;
  original: string;
  display: string;
  info?:
    | {
        // extensible as needed
        lemma: string[];
        root: string[];
        pos: string[];
        ner: string[]; // named entities
        compare: string;
        compatible: string; // searchable token
      }
    | any;
}

export interface LeraSegment {
  start_index: number;
  end_index: number;
  info: {
    // link to edit transcription  https://anonymclassic.imp.de/transcriber/edit/#{page_uuid_from}
    // in some situations two links are needed i.e. also  // link to edit transcription  https://anonymclassic.imp.de/transcriber/edit/#{page_uuid_to}
    name: string; // displayed title
    xml_id: string; // used for alignment
    page_number_from: string;
    page_number_to: string;
    facsimile_url: string;
  };
}

export interface LeraDocument {
  name: string; // display name in documents page
  siglum: string; // shorter identifier of the document
  description?: string;
  info: {
    manuscript: string;
    document_author?: string;
    first_page: string;
    last_page: string; // link to edit segmentation https://anonymclassic.imp.de/dissector/edit?first_page=#{first_page}&last_page=#{last_page}&manuscript=#{manuscript}
    chapter: string;
    unique_identifier: string; // usually "manuscript_chapter"
  };
  tokens: LeraToken[];
  segments: LeraSegment[];
}
