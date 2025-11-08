import { populate } from "dotenv";

export const advanced_results = (model, populate) => async (req, res, next) => {
  let query
  
  //Copy req.query
  const req_query = {...req.query}

  //Field to exclude
  const remove_fields = ['select', 'sort', 'page', 'limit'];

  //Loop over fields and delete them from reqQuery
  remove_fields.forEach(param => delete req_query[param])

  //Crete query stryng
  let query_str = JSON.stringify(req_query)

  //Crat operators gt gte lt lte in
  query_str = query_str.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  //Finding resource
  query = model.find(JSON.parse(query_str)).populate(populate)

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  if (req.query.sort) {
    const sort_by = req.query.sort.split(',').join(' ')
    query = query.sort(sort_by)
  } else (
    query = query.sort ('-created_at')
  )

  //Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 100
  const start_index = (page - 1) * limit
  const end_index = page * limit
  const total = await model.countDocuments();

  query = query.skip(start_index).limit(limit);
  
  //Executing query
  console.log(query_str)

  if (populate) {
    query = query.populate(populate)
  }

  //Pagination result
  const pagination = {};

  if (end_index < total) {
    pagination.next = {
      page: page + 1,
      limit,

    }
  }

  if (start_index > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  const results = await query

  if (!results) {
    return next(
      new error_response(`Result not fetched`, 404)
    )
  }

  res.advanced_results = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next()
}