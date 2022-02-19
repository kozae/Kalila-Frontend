import { ObjectId } from 'mongodb';

export const pageTranscriptionPipeline = (
  manuscriptId: string,
  pageId: string
) => [
  {
    $match: {
      _id: new ObjectId(pageId),
    },
  },
  {
    $set: {
      Id: { $toString: '$_id' },
      Version: { $toString: '$Version' },
      CreatedAt: { $toString: '$CreatedAt' },
      ManuscriptId: { $toString: '$ManuscriptId' },
    },
  },
  {
    $project: {
      _id: 0,
    },
  },
  {
    $lookup: {
      from: `Units_${manuscriptId}`,
      let: {
        number: '$Number',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                {
                  $eq: ['$StartsInPageNumber', '$$number'],
                },
                {
                  $eq: ['$EndsInPageNumber', '$$number'],
                },
                {
                  $and: [
                    {
                      $lt: ['$StartsInPageNumber', '$$number'],
                    },
                    {
                      $gt: ['$EndsInPageNumber', '$$number'],
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'BookUnits',
            localField: 'BookUnitId',
            foreignField: '_id',
            as: 'BookUnit',
          },
        },
        {
          $unwind: '$BookUnit',
        },
        {
          $set: {
            Title: '$BookUnit.Title',
            BookUnitId: { $toString: '$BookUnit._id' },
            Id: { $toString: '$_id' },
          },
        },
        {
          $project: {
            _id: 0,
            Id: 1,
            BookUnitId: 1,
            Title: 1,
            Chapter: 1,
            Order: 1,
            Type: 1,
            StartsInPageNumber: 1,
            EndsInPageNumber: 1,
            StartsInLineNumber: 1,
            EndsInLineNumber: 1,
            FirstTokenOrderInLine: 1,
            LastTokenOrderInLine: 1,
          },
        },
      ],
      as: 'Units',
    },
  },
];
