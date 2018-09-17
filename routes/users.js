import express from 'express';
import { check, validationResult } from 'express-validator/check';
import { matchedData, sanitizeQuery } from 'express-validator/filter';

import InvalidParameter from './../handlers/InvalidParameter';
import User from './../models/User';

const router = express.Router();

/* GET users listing. */
router.get('/', [
  sanitizeQuery(['sort']).customSanitizer((value, { req }) => {
    return JSON.parse(value);
  }),
  sanitizeQuery('filter').toString(),
  sanitizeQuery('page').toInt(),
  sanitizeQuery('size').toInt()
], async (req, res, next) => {
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  const filter = req.query.filter || '';
  const sort = req.query.sort || {};

  const query = filter !== '' ? {
    $or: [
      { name: { '$regex': filter, '$options': 'i' } },
      { phoneNumber: { '$regex': filter, '$options': 'i' } },
      { email: { '$regex': filter, '$options': 'i' } }
    ]
  } : {}

  let users = await User.find(query)
    .select('name email phoneNumber notesCount status createdAt')
    .sort(sort)
    .skip((page - 1) * size)
    .limit(size);

  const total = await User.where(query).countDocuments();

  return res.json({
    items: users,
    totalItems: total,
    currentPage: page,
    size,
    totalPages: Math.ceil(total / size)
  });
});

router.post('/', [
  check('name', 'name is not present and is required').exists(),
  check('status', 'status is not present and is required').exists()
    .isIn(['prospective', 'current', 'non-active']).withMessage('status must be one of values [\'prospective\',\'current\',\'non-active\']'),
  check('email', 'email is not present and is required').exists(),
  check('phoneNumber', 'phoneNumber is not present and is required').exists(),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorField = errors.array({ onlyFirstError: true })[0];
    throw new InvalidParameter({ message: errorField.msg, errorCode: errorField.param });
  }
  const userData = matchedData(req);

  const { name, email, phoneNumber, status } = userData;
  const user = new User({
    name,
    email,
    phoneNumber,
    status
  });

  user.save();

  return res.status(201).json({});
});

router.get('/:userId/notes', async (req, res, next) => {
  const notes = await User.findById(req.params.userId)
    .select('notes -_id');

  return res.json(notes);
});

router.post('/:userId/notes', [
  check('body', 'note body is not present and is required').exists(),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorField = errors.array({ onlyFirstError: true })[0];
    throw new InvalidParameter({ message: errorField.msg, errorCode: errorField.param });
  }
  const note = matchedData(req);

  User.findById(req.params.userId, (err, user) => {
    user.notes.push({
      body: note.body
    });
    user.notesCount = user.notesCount + 1;
    user.save();

    return res.status(201).json({});
  });
});

router.delete('/:userId/notes/:noteId', (req, res, next) => {
  User.updateOne({
    _id: req.params.userId
  }, {
    $pull: {
      notes: {
        _id: req.params.noteId
      }
    },
    $inc: {
      notesCount: -1
    }
  }, (err, _) => {
    return res.status(201).json({});
  });

});

module.exports = router;
