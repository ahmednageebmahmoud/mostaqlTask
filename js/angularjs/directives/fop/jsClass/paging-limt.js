
/**
 * Paging Limt class
 */
class PagingLimt {

	


	/**
	 *
	 * @param {number} skip skip items
	 * @param {number} take take items
	 * @param {string} allName name from resources
	 */
	constructor(skip, take, allName) {
		this.skip = skip||0,
			this.take = take||10;


        this.limitOptions = [{ limit: 5, name: '5' },
        { limit: 10, name: '10' },
        { limit: 20, name: '20' },
        { limit: 100, name: '100' },
        { limit: null, name: 'الكل' }];


		//change name from resouces name 
		this.limitOptions[this.limitOptions.length-1].name = allName;


      
	}
}
