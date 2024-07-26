/**
 * @description Helper Class For Apply Query Features
 * ```
 * (Searching, Filteration, Sorting, Projection, Pagination) (5 features)
 * ```
 */
class QueryFeatures {
  constructor(mongooseQuery, requestQuery) {
    this.mongooseQuery = mongooseQuery;

    this.requestQuery = requestQuery;

    this.reservedQueries = ["page", "limit", "sort", "fields", "search"];

    this.pagination = {
      page: +requestQuery.page || 1,
      limit: +requestQuery.limit || 7,
      get skip() {
        return (this.page - 1) * this.limit;
      },
    };
  }

  /**
   * @description Filter By any of properties of Model (Excluded reserved queries)
   * @example "{BASE_URL}/products?price[gte]=50.99&price[lte]=199.99&rating=4.4"
   * @returns QueryFeatures Instance
   */
  filter() {
    let queryString = { ...this.requestQuery };

    this.reservedQueries.forEach((q) => delete queryString[q]);

    queryString = JSON.stringify(queryString).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    // price: {gt: ***} -> price: {$gt: ***}
    queryString = JSON.parse(queryString);

    console.log("QueryString", queryString);

    this.mongooseQuery = this.mongooseQuery.find(queryString);

    return this;
  }

  /**
   * @description sort returned list of items based on query `sort`
   * @example "{BASE_URL}/products?sort=price,-rating" -- sort based on "price -rating"
   * @returns QueryFeatures Instance
   */
  sort() {
    const sortQuery = this.requestQuery.sort;
    if (sortQuery) {
      // sort=price,-rating -> price -rating
      const sortBy = sortQuery.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  /**
   * @description select specific fields in response body
   * @example "{BAEE_URL}/products?fields=price,title" -- get only "price title" fields in response
   * @returns QueryFeatures Instance
   */
  projection() {
    const selectionFields = this.requestQuery.fields;

    if (selectionFields) {
      const selectOnly = selectionFields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(selectOnly);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  /**
   * @description Paginate Returned List of items in Response
   * @example "{BASE_URL}/products?page=2&limit=10"
   * @returns QueryFeatures Instance
   */
  async paginate() {
    const paginate = this.pagination;
    const { limit, page, skip } = paginate;

    // Get Totol number of documents after you finished chain of filteration
    const countOfDocuments = await this.mongooseQuery.clone().countDocuments();

    paginate.numberOfPages = Math.ceil(countOfDocuments / limit);
    console.log(countOfDocuments, paginate.numberOfPages);

    paginate.nextPage = page < paginate.numberOfPages ? page + 1 : null;
    paginate.prevPage = skip > 0 ? page - 1 : null;

    this.mongooseQuery = this.mongooseQuery
      .skip(paginate.skip)
      .limit(paginate.limit);

    return this;
  }

  /**
   * @description Search in List of items based on `name`, `description`
   * @ignore keys for each model is different (name, description) exist in specific models not all.
   * @returns QueryFeatures Instance
   */
  search(...keys) {
    const searchTerm = this.requestQuery.search;

    if (searchTerm) {
      this.mongooseQuery = this.mongooseQuery.find({
        $or: keys.map((key) => ({
          [key]: { $regex: `\\b${searchTerm}\\b`, $options: "i" },
        })),
      });
    }

    return this;
  }

  async all(search = "name") {
    return await this.search(search).filter().sort().projection().paginate();
  }
}

module.exports = QueryFeatures;
