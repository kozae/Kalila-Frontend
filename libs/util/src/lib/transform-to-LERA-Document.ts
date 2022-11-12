import {
  IEdition,
  IEditionBookUnit,
  IManuscriptEdition,
  LeraDocument,
  LeraSegment,
  LeraToken,
  TokenState,
  TokenTypes,
} from '@frontend/domain';
import { bookUnitOrderDisplay } from '@frontend/util';

export function transformToLERADocuments(edition: IEdition): LeraDocument[] {
  const chapter = edition.Name.slice(0, 2);
  const bookUnits: Record<string, IEditionBookUnit> = {};
  edition.BookUnits.forEach((bu) => {
    bookUnits[bu.Id] = bu;
  });
  return edition.Manuscripts.map((e) =>
    transformToLERADocument(e, bookUnits, chapter)
  );
}

function transformToLERADocument(
  edition: IManuscriptEdition,
  bookUnits: Record<string, IEditionBookUnit>,
  chapter: string
): LeraDocument {
  const tokens: LeraToken[] = [];
  const segments: LeraSegment[] = [];
  edition.Units.forEach((u) => {
    if (u) {
      const bookUnit = bookUnits[u.BuID];
      const display = `(${bookUnitOrderDisplay(
        bookUnit.Order,
        bookUnit.FrameTags,
        ''
      )})_${bookUnit.Title.replace(/\s/g, '')}`;
      const start_index = tokens.length;
      u.Tokens.forEach((t, i) => {
        tokens.push({
          type: TokenTypes.Word,
          original: t,
          display: formatToken(t, u.States[i] as TokenState),
          info: {
            compare: u.Lemmas[i],
            lemma: [u.Lemmas[i]],
            root: [u.Lemmas[i]],
            compatible: t,
          },
        });
        tokens.push({
          type: TokenTypes.Space,
          original: ' ',
          display: ' ',
        });
      });
      segments.push({
        start_index,
        end_index: tokens.length - 1,
        info: {
          name: display,
          xml_id: display,
          page_number_from: '0',
          page_number_to: '0',
          facsimile_url: '',
        },
      });
    }
  });
  return {
    name: `${chapter}_${edition.Siglum}`,
    siglum: `${chapter}_${edition.Siglum}`,
    description: `${chapter}_${edition.Siglum}`,
    info: {
      manuscript: `${chapter}_${edition.Siglum}`,
      document_author: 'MK',
      first_page: '0',
      last_page: '0',
      chapter: chapter,
      unique_identifier: `${chapter}_${edition.Siglum}`,
    },
    tokens,
    segments,
  };
}

export function formatToken(token: string, state: TokenState) {
  switch (state) {
    case 'suppletion':
      return `{${token}}`;
    case 'suppletion_begin':
      return `{${token}`;
    case 'suppletion_end':
      return `${token}}`;
    case 'corrupt': {
      return `†${token}`;
    }
    case 'emended': {
      return `*${token}`;
    }
    case 'unintelligible': {
      return `?${token}`;
    }
    case 'dittography': {
      return `[${token}]`;
    }
    case 'dittography_begin':
      return `[${token}`;
    case 'dittography_end':
      return `${token}]`;
    case 'cross-out': {
      return `[[${token}]]`;
    }
    case 'cross-out_begin':
      return `[[${token}`;
    case 'cross-out_end':
      return `${token}]]`;
    case 'added': {
      return `<${token}>`;
    }
    case 'added_begin':
      return `<${token}`;
    case 'added_end':
      return `${token}>`;
    default:
      return token;
  }
}
