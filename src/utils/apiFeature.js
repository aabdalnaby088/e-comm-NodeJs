

export class ApiFeature {
    constructor(mongooseQuery, searchQuery){
        this.mongooseQuery = mongooseQuery; 
        this.searchQuery = searchQuery;
    }

    pagination(){
        const page = this.searchQuery.page * 1 || 1;
        if (Math.floor(page) < 1) page = 1;
        const limit = 2;
        const skip = (page - 1) * limit;
        this.page = page
        this.mongooseQuery.skip(skip).limit(limit);
        return this
    }

    filter(){
        let filterObj = structuredClone(this.searchQuery);
        filterObj = JSON.stringify(filterObj);
        filterObj = filterObj.replace(/gt|gte|lt|lte/g, val => '$' + val);
        filterObj = JSON.parse(filterObj);
        const excludedFields = ['page', 'sort', 'fields', 'search']
        excludedFields.forEach(val => {
            delete filterObj[val]
        })
        this.mongooseQuery.find(filterObj);
        return this 
    }

    sort(){
        if (this.searchQuery.sort) {
            const sortBy = this.searchQuery.sort.split(',').join(' ');
            this.mongooseQuery.sort(sortBy);
        }
        return this
    } 

    fields(){        
        
        if (this.searchQuery.fields) {
            const field = this.searchQuery.fields.split(',').join(' ');
            this.mongooseQuery.select(field);
        }
        return this 
    }

    search(){
        if (this.searchQuery.search) {
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: this.searchQuery.search, $options: 'i' } },
                    { desc: { $regex: this.searchQuery.search, $options: 'i' } },
                ]
            })
        }
        return this
    }
}