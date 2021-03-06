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
    json: (content)=>{
        return JSON.stringify(content);
    },
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


    //product show
    checkChild: (bool)=>{
        if(bool)
            return '어린이';
        else
            return '성인';
    },

    pricesExpand: (arrays)=>{
        
        return arrays.length+1;
    },    

    ifselected: (key) =>{
        if(key!=undefined){
            return 'selected';
        }
    },

    optionSelected: (chk, ans)=>{
        if(chk === ans) return 'selected';
        else return '';
    },

    //store views
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

    denyChk: (chk)=>{
        return chk? '발주확인' : '발주거부'
    },

    deleteTags: (content)=>{
        return content.replace(/[<][^>]*[>]/gi, "").slice(0,15)+'...';
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
        return array? array.length : 0;
    },

    //messages.index
    senderUrl: (sentMessages)=>{
        if(sentMessages[0].sender.provider)
            return sentMessages[0].sender.provider.store.url;
    },
    
    senderUsername: (sentMessages)=>{
        return sentMessages[0].sender.username;
    },

    //master - order
    cancelReason: (orders, id)=>{
        for(var i = 0 ; i < orders.length ; i++){
            if(orders[i].id === id){
                return orders[i].cancelRequest.cancelReason;
            }
        }
    },

    cancelChk: (chk)=>{
        return chk? "[취소완료]" : "[취소요청]"
    },

    //master - sales
    plusTwo: (elem1, elem2)=>{
        return elem1+elem2;
    },

    minusTwo: (elem1, elem2,elem3)=>{
        return elem1-elem2-elem3;
    },

    //master- sites views
    makeList: (arry)=>{
        var txt = "<li class='on'> 1 </li>";
        for(var i = 2 ; i <= arry.length; i++){
            txt += `<li>${i}</li>`;
        }
        return txt;
    },

    nthPath: (arry, i)=>{
        return arry[i].imgPath;
    },

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
    },

    //admin - store - product
    makeRows: (arry)=>{
        return arry? (arry.length):1;
    },

    selectNation: (nation, cmp)=>{
        if(nation == cmp)
        {
            return "selected";
        }
    },

    optionCities: (nation, city) =>{
        if(nation === city.nation.id){
            // return city.city;
            return `<option value=${city.id}>${city.city}</option>`
        }
    },

    listCities: (nation, city) =>{
        console.log(nation,city.id);
        if(nation === city.nation.id){
            return `<div class="city_delete">${city.city}<span>X<span></div>`
        }
    },

    //admin - sales
    checkStatus: (status) =>{
        if(status.paidChk == true && status.placeDate == null){
            return '[신규주문]'
        }
        else if(status.paidChk == true && status.placeChk == true && status.denyChk == false){
            return '[서비스이용중]'
        }
        else if(status.paidChk == true && status.placeChk == true && status.finalChk == true){
            return '[구매확정]'
        }
    },

    subtract: (one, two) =>{
        return one - two;
    },

    withdrawnStatus: (chk, requestedDate, withdrawnDate) =>{
        console.log(requestedDate, withdrawnDate)
        if(chk == null){
            return '입금신청하기'
        }
        else if(chk == true){
            return '입금완료\n '+makeDate(withdrawnDate);
        }
        else if(chk == false){
            return '입금신청\n  '+makeDate(requestedDate);
        }
    },

    ifTrue: (chk) => {
        if(chk)
            return 'checked'
    },

    ifFalse: (chk) => {
        if(!chk)
            return 'checked'
    },

    ifA: (chk) => {
        if(chk==='A')
            return 'checked'
    },

    ifB: (chk) => {
        if(chk==='B')
            return 'checked'
    },

}