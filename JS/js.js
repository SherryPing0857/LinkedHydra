const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-85250B0A-A44C-450A-9650-C390EBDFDCF8&locationName='
let orginalData;
let orgData = {};
//連結API
fetchData();
function fetchData() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(3, data);
            orginalData = data;
            organizationData();
            arrange_cities();
        });
}
//從API裡面抓需要的資料
function organizationData() {
    const locationAll = orginalData.records.location;
    // console.log(locationAll);
    locationAll.forEach(location => {
        // console.log(location.locationName);
        const locationName = location.locationName;
        const wEl0T0 = location.weatherElement[0].time[0];
        // console.log(wEl0T0);
        const startTime = wEl0T0.startTime;
        // console.log(startTime);
        const wxCondition = wEl0T0.parameter.parameterName;
        let wxImgCode = wEl0T0.parameter.parameterValue;
        // console.log(wxCondition,wxImgCode);
        const maxT = location.weatherElement[4].time[0].parameter.parameterName;
        // console.log(maxT);
        //把組織後的資料物放入orgData
        orgData[locationName] = {
            'Wx': wxCondition,
            'WxCode': wxImgCode,
            'startTime': startTime,
            'maxT': maxT,//將location化為key值
        };
    });
}
console.log(orgData);

//處理各縣市
const btnAll = document.querySelectorAll('.btn');
const cardRegion = document.querySelector('.card-area');
var CitiesAll = [
    //index=0
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'],
    //index=1
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣'],
    ['臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣'],
    ['臺南市', '高雄市', '屏東縣'],
    ['宜蘭縣', '花蓮縣', '臺東縣'],
    ['澎湖縣', '金門縣', '連江縣'],]

//點擊按鈕會有的反應    
let cityRegionAll = CitiesAll[0];//進網頁預設是index=0
//按按鈕會跑到對應分類，用index定位，另一種方法是在div裡面加分類
//範例:<button class="btn" data-region="all">全台天氣</button>
//js:之後cityRegionAll = CitiesAll[index];改成
//   const regionKey = btn.getAttribute('data-region');
//   (當中getAttribute 是 JavaScript 的 DOM 方法，用來取得 HTML 標籤上的屬性值)
btnAll.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        cityRegionAll = CitiesAll[index];
        arrange_cities();
    });
});

// console.log(cityRegionAll);
//對應選到的城市
const topBox = document.querySelector('.top-box');
let content = '';
function arrange_cities() {
    if (cityRegionAll.length > 0) {//另外把startTime抓到topBox顯示
        const firstCityTime = cityRegionAll[0];//每個統計時間一樣，所以取第一個城市就好了
        let startTime;
        if (orgData[firstCityTime] && orgData[firstCityTime].startTime) {
            startTime = orgData[firstCityTime].startTime;
        } else {
            startTime = '無資料';
        }
        topBox.innerText = `預報起始時間：${startTime}`;
    }


    content = '';//顯示每個區域前都要清空
    cityRegionAll.forEach(city => {
        const cityData = orgData[city];
        showCard(city, cityData);//citydata資訊加到content裡(下一個函式做處理)
    })
    cardRegion.innerHTML = content;
}

//生成抓取的圖片
// 裡面網址的01、02等等他的0被當成數值了，所以要強制讓他辨認這是字串(img那一行)，padStart那航指如果字串長度不足 2 個字元，就在開頭補上 0
function showCard(city, cityData) {
    content +=
        `
        <div class="card">
          <div class="info_left">
            <h3 class="info_element">${city}</h3>
            <div class="info_element">${cityData.Wx}</div>
            <div class="info_element">${cityData.maxT}<sup>°C</sup></div>
          </div>
          <div class="info_right">
            <img src="https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/${String(cityData.WxCode).padStart(2, '0')}.svg" alt="${cityData.Wx}" title="${cityData.Wx}">
          </div>
        </div>
      
          `
}