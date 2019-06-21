const makeDate = function() {
    const d = new Date();
    let formattedDate = '';

    //Add 1 to correct format as it starts with 0.
    formattedDate += (d.getMonth() + 1) + '_';
    formattedDate += d.getDate() + '_';
    formattedDate += d.getFullYear();

    return formattedDate;
};

module.exports = makeDate;