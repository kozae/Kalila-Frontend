import { NextApiRequest, NextApiResponse } from 'next';
import ObjectID from 'bson-objectid';
import fs from 'fs';
import path from 'path';
// Map of symbols to labels
const SYMBOL_TO_LABEL: { [key: string]: string } = {
  '*': 'emended',
  '†': 'corrupt',
  '?': 'unintelligible',
  '!': 'lexical-error',
  '[]': 'dittography',
  '[': 'dittography_begin',
  ']': 'dittography_end',
  '[[]]': 'cross-out',
  ']]': 'cross-out_end',
  '[[': 'cross-out_begin',
  '{}': 'suppletion_begin',
  '{': 'suppletion_begin',
  '}': 'suppletion_end',
  '<>': 'added',
  '<': 'added_begin',
  '>': 'added_end',
  '()': 'title',
  '(': 'title_begin',
  ')': 'title_end',
};

const get_state = (symbol: string): string => {
  return SYMBOL_TO_LABEL[symbol] || 'sound';
};

const generate_json_output = (
  page_key: string,
  element_list: any[],
  data: any
) => {
  const output_data = [];
  const lines = data[page_key]?.lines || [];
  let token_counter = 0;
  for (let idx = 0; idx < Math.min(element_list.length, lines.length); idx++) {
    const element = element_list[idx];
    const line = lines[idx];
    const line_data = {
      ElementId: element.ElementId,
      LineId: element.Id,
      Tokens: [],
    };
    for (let token_idx = 0; token_idx < line.length; token_idx++) {
      const token_data = {
        Id: ObjectID().toString(),
        RawToken: line[token_idx][0],
        MorphemeType: 'host',
        SpaceFollows: true,
        OrderInLine: token_idx,
        State: get_state(line[token_idx][1]),
        OrderInPage: token_counter,
        Morphology: [],
      };
      line_data.Tokens.push(token_data);
      token_counter += 1;
    }
    output_data.push(line_data);
  }
  return output_data;
};

const segmentPattern = /\/(\d+(\.\d+)?)/g;
const nonArabicPattern = /[^\u0600-\u06FF]/g;

const parse_arabic_file = (filePath: string) => {
  const result_dict: { [key: string]: any } = {};

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  let current_key: string | null = null;

  fileContent.split('\n').forEach((line) => {
    line = line.trim();

    if (line.startsWith('fol')) {
      current_key = line;
      result_dict[current_key] = { lines: [], segments: [] };
    } else if (current_key) {
      const segments: any[] = [];

      let match;
      while ((match = segmentPattern.exec(line))) {
        segments.push([
          match[1],
          line.slice(0, match.index).split(' ').length - 1,
        ]);
      }

      const cleaned_line = line.replace(segmentPattern, '');
      const tokens = cleaned_line
        .split(' ')
        .filter((token) => token.length > 0);

      if (tokens.length === 0) return;
      const updated_tokens = tokens.map((token) => {
        const symbols = token.match(nonArabicPattern)?.join('') || '';
        const arabic_part = token.replace(nonArabicPattern, '');
        return [arabic_part, symbols];
      });

      result_dict[current_key].lines.push(updated_tokens);
      result_dict[current_key].segments.push(...segments);
    }
  });

  return result_dict;
};

const PATH = '/root/Kalila/next/frontend/apps/kalila/pages/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { key } = req.query;

  const parsed_data = parse_arabic_file(path.join(PATH, 'src.txt'));

  const element_list = req.body;
  const output = generate_json_output(key as string, element_list, parsed_data);

  res.status(200).json(output);
}
