/* eslint-disable node/no-unsupported-features/es-syntax */

class ApiFeatures {
    constructor(query, queryObject) {
        this.query = query;
        this.queryObject = queryObject;
    }

    filter() {
        // 1A) prepare the query (Basic Filtering)
        let queryObject = { ...this.queryObject };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((field) => delete queryObject[field]);

        // 1B) convert the query to mongoose query (Advanced Filtering)
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        queryObject = JSON.parse(queryString);

        // prepare the query
        this.query = this.query.find(queryObject);
        return this;
    }

    sort() {
        // 2) sort the query
        if (this.queryObject.sort) {
            const sortBy = this.queryObject.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        // default sort by createdAt (desc)
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        // 3) Field Limiting
        if (this.queryObject.fields) {
            const fields = this.queryObject.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        // default field limiting (exclude createdAt, updatedAt, __v)
        else {
            this.query = this.query.select('-createdAt -updatedAt -__v');
        }
        return this;
    }

    paginate() {
        // 4A) Pagination
        const page = parseInt(this.queryObject.page, 10);
        const limit = parseInt(this.queryObject.limit, 10);
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ApiFeatures;
