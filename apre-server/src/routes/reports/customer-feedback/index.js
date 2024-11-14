/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre customer feedback API for the customer feedback reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /channel-rating-by-month
 *
 * Fetches average customer feedback ratings by channel for a specified month.
 *
 * Example:
 * fetch('/channel-rating-by-month?month=1')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/channel-rating-by-month', (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return next(createError(400, 'month and channel are required'));
    }

    mongo (async db => {
      const data = await db.collection('customerFeedback').aggregate([
        {
          $addFields: {
            date: { $toDate: '$date' }
          }
        },
        {
          $group: {
            _id: {
              channel: "$channel",
              month: { $month: "$date" },
            },
            ratingAvg: { $avg: '$rating'}
          }
        },
        {
          $match: {
            '_id.month': Number(month)
          }
        },
        {
          $group: {
            _id: '$_id.channel',
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channel: '$_id',
            ratingAvg: 1
          }
        },
        {
          $group: {
            _id: null,
            channels: { $push: '$channel' },
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channels: 1,
            ratingAvg: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);

  } catch (err) {
    console.error('Error in /rating-by-date-range-and-channel', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /by-channel
 *
 * Fetches customer feedback data by channel
 *
 * Example:
 * fetch('/by-channel?channel=Retail')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/by-channel', async(req, res, next) => {
try {
  const { channel } = req.query; /// Get channel from query string

  if (!channel) { // If channel is not specified
    return next(createError(400, 'channel is required')) // throw a 400 error with "channel is required" message
  }

  mongo (async db => {
    const data = await db.collection('customerFeedback').aggregate([
      {
        '$match': { // match on the given channel
          'channel': channel
        }
      }, {
        '$lookup': { // lookup the agent details from the agents collection using the agentID field
          'from': 'agents',
          'localField': 'agentId',
          'foreignField': 'agentId',
          'as': 'agentDetails'
        }
      }, {
        '$addFields': {
          'agentDetails': {
            '$arrayElemAt': [
              '$agentDetails', 0 // get the first entry from the agentDetails array
            ]
          }
        }
      }, {
        '$project': { // Include only these fields in the result, expect _id
          '_id': 0,
          'date': 1,
          'region': 1,
          'product': 1,
          'category': 1,
          'channel': 1,
          'salesperson': 1,
          'customer': 1,
          'rating': 1,
          'feedbackType': 1,
          'feedbackText': 1,
          'agentId': 1,
          'agentDetails': 1
        }
      }
    ]).toArray();

    res.send(data);
  }, next)
} catch (err) {
  console.error('Error in /by-channel', err);
    next(err);
}
});

module.exports = router;