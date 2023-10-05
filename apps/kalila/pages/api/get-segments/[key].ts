import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { bookUnits } from '@frontend/server-side-queries';
import { distance } from 'fastest-levenshtein';

function findMostSimilar(searchString: string, list: string[]): string {
  let minDistance = Infinity;
  let mostSimilarString = '';
  console.log({ searchString });
  for (const str of list) {
    const currentDistance = distance(searchString, str);

    if (currentDistance < minDistance) {
      minDistance = currentDistance;
      mostSimilarString = str;
      console.log({ currentDistance });
      console.log({ mostSimilarString });
    }
  }

  return mostSimilarString;
}

const getSegments = (fileContent: string) => {
  // Initialize the main dictionary to store results
  const resultDict: Record<string, any[]> = {};

  // Regular expression patterns
  const segmentPattern = /\/(\d+(\.\d+)?)/g;

  const lines = fileContent.split('\n');
  let currentKey: string | null = null;
  let lineIndex = 0; // To keep track of the line number

  lines.forEach((line) => {
    line = line.trim();
    // Check if the line starts with 'fol'
    if (line.startsWith('fol')) {
      currentKey = line;
      lineIndex = 0; // Reset the line index
    } else if (currentKey) {
      // If we are within a 'fol' section
      // Extract segments and their positions

      let modifiedLine = line;
      let match;
      while ((match = segmentPattern.exec(modifiedLine)) !== null) {
        const segment = match[1];
        const tokenPosition = Math.max(
          line.slice(0, match.index).split(' ').length - 1,
          0
        );
        if (!resultDict[currentKey]) {
          resultDict[currentKey] = [];
        }
        resultDict[currentKey].push({
          segment,
          line: lineIndex,
          token: tokenPosition,
        });

        // Replace the segment with placeholders to not interfere with next calculations
        modifiedLine =
          modifiedLine.slice(0, match.index) +
          ' '.repeat(match[0].length) +
          modifiedLine.slice(match.index + match[0].length);
      }
      // Increment the line index after processing a line
      lineIndex += 1;
    }
  });

  return resultDict;
};

const PATH = '/root/Kalila/next/frontend/apps/kalila/pages/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key } = req.query;
  const fileContent = fs.readFileSync(path.join(PATH, 'src.txt'), 'utf-8');

  const parsedData = getSegments(fileContent);
  const mappings = modifyObjectKeys(
    JSON.parse(fs.readFileSync(path.join(PATH, 'units_mapping.json'), 'utf-8'))
  );

  const segments = [];
  const ids: string[] = [];
  console.log({ segments });
  for (const item of parsedData[key as string]) {
    const unit = removeTrailingDot(item.segment);
    if (mappings[unit]) {
      ids.push(mappings[unit]);
      segments.push({
        ...item,
        unit,
        segment: mappings[unit],
      });
    } else {
      const heuristic = `${unit}.1`;
      if (mappings[heuristic]) {
        ids.push(mappings[heuristic]);
        segments.push({
          ...item,
          unit,
          heuristic,
          segment: mappings[heuristic],
        });
      } else {
        const bestGuess = findMostSimilar(unit, Object.keys(mappings));
        ids.push(mappings[bestGuess]);
        segments.push({
          ...item,
          unit,
          bestGuess,
          segment: mappings[bestGuess],
        });
      }
    }
  }

  const unitData = await bookUnits(ids);

  const units: Record<string, any> = {};

  for (const item of unitData) {
    units[item.Id] = item;
  }

  res.status(200).json({ segments, units });
}

function removeTrailingDot(str) {
  if (str?.endsWith('.')) {
    return str.slice(0, -1);
  }
  return str;
}

function modifyObjectKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [removeTrailingDot(key), value])
  );
}
