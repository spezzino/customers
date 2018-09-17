import User from '../models/User';

async function getUsers(req, res, next) {
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
}

export { getUsers };
