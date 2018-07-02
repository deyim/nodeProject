module.exports = {
    makeDate: (pgDate)=>{
        if(pgDate == null){
            return '0000-00-00'
        }
        let thisDate = pgDate.toString().split(" ");
        let mm = thisDate[1];
        let dd = thisDate[2];
        let yr = thisDate[3];

        switch(mm) {
            case 'Jan':
                mm = '01'
                break;
            case 'Feb':
                mm = '02'
                break;   
            case 'Mar':
                mm = '03'
                break; 
            case 'Apr':
                mm = '04'
                break; 
            case 'May':
                mm = '05'
                break;
            case 'Jun':
                mm = '06'
                break;
            case 'Jul':
                mm = '07'
                break;
            case 'Aug':
                mm = '08'
                break; 
            case 'Sep':
                mm = '09'
                break; 
            case 'Oct':
                mm = '10'
                break;
            case 'Nov':
                mm = '11'
                break;
            case 'Dec':
                mm = '12'
                break;
        }

        return yr+'-'+mm+'-'+dd;
    },

    phone1: (phone) =>{
        if(phone==null){
            return '0000';
        }
        return phone.slice(4,8);
    },

    phone2: (phone) =>{
        if(phone==null){
            return '0000';
        }
        return phone.slice(9,13);
    },

    ifchecked: (bool) =>{
        return bool? 'checked' : '';
    },

    selectCities: (city, nation_id)=>{
        if(city.nationId == nation_id)
            return city.city+';';
    },

    saleChk: (chk)=>{
        return chk? '판매중' : '판매중지'
    },

    usedChk: (chk)=>{
        return chk? '사용' : '미사용'
    },

    notUsedCount: (targs)=>{
        let cnt = 0;
        for(var i = 0 ; i<targs.length ;i++){
            if(targs[i].usedChk == false)
                cnt++;
        }
        return cnt;
    }

}