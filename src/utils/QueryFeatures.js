/**
 * @description Helper Class For Apply Query Features (filter, sort, select, pagination)
 */
class QueryFeatures {
  constructor(mongooseQuery, requestQuery) {
    this.mongooseQuery = mongooseQuery;

    this.requestQuery = requestQuery;

    this.reservedQueries = ["page", "limit", "sort", "fields", "search"];
  }

  /**
   * @description Filter By any of properties of Model (Excluded reserved queries)
   * @example "{BASE_URL}/products?price[gte]=50.99&price[lte]=199.99&rating=4.4"
   * @returns QueryFeatures Instance
   */
  filter() {
    let queryString = { ...this.requestQuery };

    queryString = JSON.stringify(queryString).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    // price: {gt: ***} -> price: {$gt: ***}
    queryString = JSON.parse(queryString);

    const filterBy = this.reservedQueries.forEach((q) => delete queryString[q]);

    this.mongooseQuery = this.mongooseQuery.find(filterBy);

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
  paginate() {
    const paginate = {
      page: this.requestQuery.page || 1,
      limit: this.requestQuery.limit || 7,
      get skip() {
        return (this.page - 1) * this.limit;
      },
    };

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
  search() {
    const searchTerm = this.requestQuery.search;

    if (searchTerm) {
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      });
    }

    return this;
  }
}

module.exports = QueryFeatures;
