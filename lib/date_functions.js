module.exports = {
    getToday: ()=>{
        let today = new Date();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        let yr = today.getFullYear()

        return [yr,
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
    },

    getFirstday: ()=>{
        return '2018-02-08';
    }
}