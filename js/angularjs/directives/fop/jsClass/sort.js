/**
 * sort items 
 */
class Sort {

	//set property name for sort
	sortBy(propName) {
		if (propName === this.propName)
			this.reverse = !this.reverse;
		else
			this.reverse = true;

		this.propName = propName;
	};

	//check from sort case and name for set specific class
	ifSortClass(propName, sortCase) {
		return this.propName === propName && this.reverse == sortCase;
	};

	/**
	 * sort items 
	 * @param {String} propName اسم البروبرتى الافتراية 
	 * @param {Bool} reverse طريقة الترتيب الافتراضية 
	 */
	constructor(propName, reverse) {
		this.propName = propName;
		this.reverse = reverse;
	}
}