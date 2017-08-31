# qidian
[票夹、消费按书过滤](javascript:%20var%20title%20=%20prompt%28%27%E4%B9%A6%E5%90%8D%27,%20%27%E5%A4%A9%E9%86%92%E4%B9%8B%E8%B7%AF%27%29;%20var%20delay%20=%20Number%28prompt%28%27%E7%BF%BB%E9%A1%B5%E5%BB%B6%E6%97%B6%28ms%29%27,%20500%29%29;%20$%28%27.icon-close%27%29.click%28%29;%20var%20temp%20=%20%5B%5D;%20function%20run%28temp%29%20%7B%20var%20page%20=%20Number%28$%28%27.ui-page-current%27%29%5B0%5D.innerText%29;%20setTimeout%28function%28%29%20%7B%20Array.from%28$%28%27.checked%20.wbba%27%29%29.forEach%28function%28e%29%20%7B%20if%20%28!e.innerText.includes%28title%29%29%20e.parentNode.style.display%20=%20%27none%27;%20else%20temp.push%28e.parentNode%29;%20%7D%29;%20%7D,%20delay%29;%20setTimeout%28function%28%29%20%7B%20if%20%28$%28%27a.ui-page-next%27%29%5B0%5D%29%20%7B%20$%28%27a.ui-page-next%27%29.click%28%29;%20temp%20=%20run%28temp%29%20%7D%20else%20%7B%20$%28%27.checked%20.table-size%27%29%5B0%5D.style.height%20=%20%2841%20+%2051%20*%20temp.length%29%20+%20%27px%27;%20temp.sum%20=%20temp.reduce%28function%28s,%20e%29%20%7B%20$%28%27.checked%20tbody%27%29%5B0%5D.appendChild%28e%29;%20return%20s%20+%20Number%28/%5Cd+/.exec%28e.getElementsByTagName%28%27td%27%29%5BArray.from%28$%28%27.checked%20th%27%29%29.findIndex%28function%28e%29%20%7B%20return%20%5B%27%E6%95%B0%27,%20%27%E9%87%91%27%5D.some%28function%28ee%29%20%7B%20return%20e.innerText.includes%28ee%29%20%7D%29%20%7D%29%5D.innerText%29%5B0%5D%29%20%7D,%200%29;%20var%20a%20=%20%5B%5B%27%E6%9C%88%E7%A5%A8%27,%20%27%E5%BC%A0%27%5D,%20%5B%27%E6%8E%A8%E8%8D%90%27,%20%27%E5%BC%A0%27%5D,%20%5B$%28%27.ui-select-text%27%29%5B0%5D%20?%20$%28%27.ui-select-text%27%29%5B0%5D.innerText%20:%20%27%27,%20%27%E7%82%B9%27%5D%5D.find%28function%28e,%20n%29%20%7B%20return%20$%28%27a.checked%27%29%5B0%5D.innerText.includes%28n%20%3E%201%20?%20%27%E6%B6%88%E8%B4%B9%27%20:%20e%5B0%5D%29%20%7D%29;%20a.splice%281,%200,%20temp.sum%29;%20var%20ee%20=%20setInterval%28function%28%29%20%7B%20if%20%28$%28%27.checked%20.table-size%27%29%5B0%5D.style.height%20==%20%2841%20%20%2051%20*%20temp.length%29%20%20%20%27px%27%29%20%7B%20clearInterval%28ee%29;%20var%20e%20=%20setInterval%28function%28%29%20%7B%20var%20script%20=%20document.createElement%28%27script%27%29;%20script.type%20=%20%22text/javascript%22;%20script.src%20=%20%22https://github.com/niklasvh/html2canvas/releases/download/0.4.1/html2canvas.js%22;%20$%28%27head%27%29%5B0%5D.appendChild%28script%29;%20if%20%28html2canvas%29%20%7B%20clearInterval%28e%29;%20html2canvas%28document.body,%20%7B%20onrendered:%20function%28canvas%29%20%7B%20var%20context%20=%20canvas.getContext%28%272d%27%29;%20var%20link%20=%20document.createElement%28%27a%27%29;%20link.href%20=%20canvas.toDataURL%28%29;%20link.download%20=%20%5Bg_data.user.nickName,%20title,%20a.join%28%27%27%29,%20new%20Date%28%29.toLocaleDateString%28%29%5D.join%28%27-%27%29%20%20%20%27.png%27;%20link.click%28%29;%20%7D%20%7D%29%20%7D%20%7D,%20500%29;%20%7D%20%7D,%20200%29;%20%7D%20%7D,%202%20*%20delay%29;%20return%20temp;%20%7D%20temp%20=%20run%28temp%29;)
```
javascript: var title = prompt('书名', '天醒之路');
var delay = Number(prompt('翻页延时(ms)', 500));
$('.icon-close').click();
var temp = [];
function run(temp) {
    var page = Number($('.ui-page-current')[0].innerText);
    setTimeout(function() {
        Array.from($('.checked .wbba')).forEach(function(e) {
            if (!e.innerText.includes(title))
                e.parentNode.style.display = 'none';
            else
                temp.push(e.parentNode);
        });
    }, delay);
    setTimeout(function() {
        if ($('a.ui-page-next')[0]) {
            $('a.ui-page-next').click();
            run(temp)
        } else {
            $('.checked .table-size')[0].style.height = (41 + 51 * temp.length) + 'px';
            temp.sum = temp.reduce(function(s, e) {
                $('.checked tbody')[0].appendChild(e);
                return s + Number(/\d+/.exec(e.getElementsByTagName('td')[Array.from($('.checked th')).findIndex(function(e) {
                    return ['数', '金'].some(function(ee) {
                        return e.innerText.includes(ee)
                    })
                })].innerText)[0])
            }, 0);
            var a = [['月票', '张'], ['推荐', '张'], [$('.ui-select-text')[0] ? $('.ui-select-text')[0].innerText : '', '点']].find(function(e, n) {
                return $('a.checked')[0].innerText.includes(n > 1 ? '消费' : e[0])
            });
            a.splice(1, 0, temp.sum);
            var ee = setInterval(function() {
                if ($('.checked .table-size')[0].style.height == (41 + 51 * temp.length) + 'px') {
                    clearInterval(ee);
                    var e = setInterval(function() {
                        var script = document.createElement('script');
                        script.type = "text/javascript";
                        script.src = "https://github.com/niklasvh/html2canvas/releases/download/0.4.1/html2canvas.js";
                        $('head')[0].appendChild(script);
                        if (html2canvas) {
                            clearInterval(e);
                            html2canvas(document.body, {
                                onrendered: function(canvas) {
                                    var context = canvas.getContext('2d');
                                    var link = document.createElement('a');
                                    link.href = canvas.toDataURL();
                                    link.download = [g_data.user.nickName, title, a.join(''), new Date().toLocaleDateString()].join('-') + '.png';
                                    link.click();
                                }
                            })
                        }
                    }, 500);
                }
            }, 200);
        }
    }, 2 * delay);
}

run(temp);
```
