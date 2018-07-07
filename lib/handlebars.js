let makeDate = (pgDate)=>{
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
}

module.exports = {
    //common
    makeQuery: (q)=>{
        if(!q) return ''
        let query = ''
        for (var property in q) {
            query += ('&'+property+'='+q[property]);
        }
        return query;
    },

    makeDate,

    //members - providers
    setCompanyType: (type)=>{
        if(type==='A')
            return '국내_일반';
        else if(type === 'B')
            return '국내_사업자';
        else if(type === 'C')
            return '해외_일반';
        else
            return '해외_사업자';
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

    ifchecked: (bool, q) =>{
        if(Object.keys(q).length === 0 && q.constructor === Object)
            return 'checked';
        return bool? 'checked' : '';
    },

    ifselected: (key) =>{
        if(key!=undefined){
            return 'selected';
        }
    },

    optionSelected: (chk, ans)=>{
        if(chk == ans) return 'selected';
        else return '';
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

    cancelChk: (chk)=>{
        return chk? '발주거부' : '발주확인'
    },

    notUsedCount: (targs)=>{
        let cnt = 0;
        for(var i = 0 ; i<targs.length ;i++){
            if(targs[i].usedChk == false)
                cnt++;
        }
        return cnt;
    },

    length: (array)=>{
        return array.length;
    },

    //messages.index
    senderUrl: (sentMessages)=>{
        if(sentMessages[0].sender.provider)
            return sentMessages[0].sender.provider.store.url;
    },
    
    senderUsername: (sentMessages)=>{
        return sentMessages[0].sender.username;
    },

    //site
    typeChk: (chk)=>{
        return chk=='A'? '사용자' : '스토어';
    },

    codeSelect: (thisCode, code)=>{
        if(thisCode == code)
            return 'selected';
    },

    typeSelect: (thisType, type)=>{
        if(thisType == type)
            return 'selected';
    },

    //admin - members
    storeOrderCnt: (stores)=>{        
        return stores[0].StoreUsers.orderCnt;
    },

    storeCreatedAt: (stores)=>{
        return makeDate(stores[0].StoreUsers.createdAt);
    }

}